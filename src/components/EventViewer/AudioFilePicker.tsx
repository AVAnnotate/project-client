import { useStore } from '@nanostores/react';
import type { CollectionEntry } from 'astro:content';
import { useEffect } from 'react';
import { PlayFill } from 'react-bootstrap-icons';
import { $pagePlayersState, setAvFile } from 'src/store.ts';
import { formatTimestamp } from 'src/utils/player.ts';

interface Props {
  event: CollectionEntry<'events'>;
  playerId: string;
}

const AudioFilePicker: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);

  return (
    <div className='py-2'>
      <p>{props.event.data.label}</p>
      <ol className='flex flex-col gap-2'>
        {Object.keys(props.event.data.audiovisual_files).map((uuid) => {
          const avFile = props.event.data.audiovisual_files[uuid];

          return (
            <li
              className='flex gap-2 items-center hover:cursor-pointer'
              onClick={() => setAvFile(uuid, props.playerId)}
              key={uuid}
            >
              <div className='w-4'>
                {store[props.playerId]?.avFileUuid === uuid && <PlayFill />}
              </div>
              <span>{avFile.label}</span>
              <span className='flex items-center border border-black rounded-[5px] text-xs p-2 font-semibold h-6'>
                {formatTimestamp(avFile.duration, false)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default AudioFilePicker;
