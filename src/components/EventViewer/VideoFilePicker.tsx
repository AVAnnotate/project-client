import { useStore } from '@nanostores/react';
import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';
import { PlayFill } from 'react-bootstrap-icons';
import { $pagePlayersState, setAvFile } from 'src/store.ts';
import { formatTimestamp } from 'src/utils/player.ts';
import RichText from '@components/RichText/index.astro';

interface Props {
  event: CollectionEntry<'events'>;
  playerId: string;
  // "children" is the rich text component for the description.
  // while we can't render an Astro component from a React component,
  // we can apparently pass it as a child component inside the React
  // component!
  children?: any;
}

const VideoFilePicker: React.FC<Props> = (props) => {
  const [tab, setTab] = useState<'desc' | 'picker'>(
    props.children ? 'desc' : 'picker'
  );
  const store = useStore($pagePlayersState);

  const getButtonClassNames = (buttonTab: typeof tab) => {
    const baseStyle = '';

    if (buttonTab === tab) {
      return `${baseStyle} underline`;
    } else {
      return `${baseStyle} underline text-gray-400`;
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
        {tab === 'desc' && (
          <>
            {props.children}
            {props.event.data.citation && <p>{props.event.data.citation}</p>}
          </>
        )}
        {tab === 'picker' && (
          <ol className='flex gap-2 flex-wrap'>
            {Object.keys(props.event.data.audiovisual_files).map(
              (uuid, idx) => {
                const avFile = props.event.data.audiovisual_files[uuid];
                const isCurrentFile =
                  store[props.playerId]?.avFileUuid === uuid;

                return (
                  <li
                    className='flex gap-2 items-center hover:cursor-pointer'
                    onClick={() => setAvFile(uuid, props.playerId)}
                    key={uuid}
                  >
                    <div className='w-4'>{isCurrentFile && <PlayFill />}</div>
                    <span className={isCurrentFile ? 'font-bold' : ''}>
                      {idx + 1}. &nbsp;
                      {avFile.label}
                    </span>
                    <span className='flex items-center border border-black rounded-[5px] text-xs p-2 font-semibold h-6'>
                      {formatTimestamp(avFile.duration, false)}
                    </span>
                  </li>
                );
              }
            )}
          </ol>
        )}
      </div>
    </div>
  );
};

export default VideoFilePicker;
