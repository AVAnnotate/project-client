import { Select } from '@headlessui/react';
import { useStore } from '@nanostores/react';
import type { CollectionEntry } from 'astro:content';
import { PlayFill } from 'react-bootstrap-icons';
import { $pagePlayersState, setAvFile } from 'src/store.ts';
import { defaultState, formatTimestamp } from 'src/utils/player.ts';

interface Props {
  event: CollectionEntry<'events'>;
  playerId: string;
}

const AudioFilePicker: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);

  const playerState = store[props.playerId] || { ...defaultState };

  // default to the first file for SSR
  const currentFile =
    playerState.avFileUuid ||
    Object.keys(props.event.data.audiovisual_files)[0];

  return (
    <div className='py-2 flex flex-row gap-3 items-center'>
      <p>AV File</p>
      <Select
        name='file'
        aria-label='AV file picker'
        onChange={(e: any) => setAvFile(e.target.value, props.playerId)}
        className='py-1.5 px-3 border border-black rounded-md bg-white'
      >
        {Object.keys(props.event.data.audiovisual_files).map((uuid, idx) => {
          const avFile = props.event.data.audiovisual_files[uuid];
          return (
            <option value={uuid} key={idx}>
              {avFile.label}
            </option>
          );
        })}
      </Select>
    </div>
  );
};

export default AudioFilePicker;
