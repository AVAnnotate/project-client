import { useStore } from '@nanostores/react';
import type { CollectionEntry } from 'astro:content';
import { useEffect, useRef, useState } from 'react';
import { $pagePlayersState, setAvFile } from 'src/store.ts';
import { formatTimestamp } from 'src/utils/player.ts';

interface ThumbCanvasProps {
  url: string;
}

const ThumbCanvas: React.FC<ThumbCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const videoEl = document.createElement('video');
      videoEl.src = props.url;

      videoEl.onloadeddata = () => {
        if (canvasRef.current) {
          // set the internal canvas dimensions to 2x for better image quality
          // this doesn't affect CSS, just the canvas's own drawing surface
          canvasRef.current.height = 180;
          canvasRef.current.width = 240;
          const ctx = canvasRef.current.getContext('2d', { alpha: false });

          if (ctx) {
            // draw black background
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.fillRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );

            const videoRatio = videoEl.videoHeight / videoEl.videoWidth;
            const canvasRatio =
              canvasRef.current.height / canvasRef.current.width;

            if (videoRatio > canvasRatio) {
              const height = canvasRef.current.width * videoRatio;
              ctx.drawImage(
                videoEl,
                0,
                Math.floor(canvasRef.current.height - height / 2),
                canvasRef.current.width,
                height
              );
            } else {
              const width =
                (canvasRef.current.width * canvasRatio) / videoRatio;
              ctx.drawImage(videoEl, 0, 0, width, canvasRef.current.height);
            }
          }
        }
      };
    }
  }, [props.url, canvasRef.current]);

  return <canvas className='w-[120px] h-[90px]' ref={canvasRef} />;
};

interface VideoFilePickerProps {
  event: CollectionEntry<'events'>;
  playerId: string;
  // "children" is the rich text component for the description.
  // while we can't render an Astro component from a React component,
  // we can apparently pass it as a child component inside the React
  // component!
  children?: any;
}

const VideoFilePicker: React.FC<VideoFilePickerProps> = (props) => {
  const [tab, setTab] = useState<'desc' | 'picker'>(
    props.children ? 'desc' : 'picker'
  );

  const getButtonClassNames = (buttonTab: typeof tab) => {
    const baseStyle = 'py-2 mb-4';

    if (buttonTab === tab) {
      return `${baseStyle} border-b-2 border-solid border-secondary mt-[2px]`;
    } else {
      return `${baseStyle} text-gray-400`;
    }
  };

  return (
    <div className='py-2'>
      <div className='flex gap-4'>
        <button
          onClick={() => setTab('desc')}
          role='button'
          className={getButtonClassNames('desc')}
        >
          Description
        </button>
        <button
          onClick={() => setTab('picker')}
          role='button'
          className={getButtonClassNames('picker')}
        >
          Contents
        </button>
      </div>
      <div>
        <div className={tab !== 'desc' ? 'hidden' : ''}>
          {props.children}
          {props.event.data.citation && <p>{props.event.data.citation}</p>}
        </div>
        <div
          className={`grid grid-cols-2 gap-2 py-2 ${
            tab !== 'picker' ? 'hidden' : ''
          }`}
        >
          {Object.keys(props.event.data.audiovisual_files).map((uuid, idx) => {
            const avFile = props.event.data.audiovisual_files[uuid];

            return (
              <div
                className='h-[90px] hover:cursor-pointer hover:bg-gray-200 flex gap-2'
                key={uuid}
                onClick={() => setAvFile(uuid, props.playerId)}
              >
                <ThumbCanvas url={avFile.file_url} />
                <div className='flex flex-col gap-2'>
                  <p>
                    {idx + 1}.&nbsp;{avFile.label}
                  </p>
                  <p>{formatTimestamp(avFile.duration, false)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoFilePicker;
