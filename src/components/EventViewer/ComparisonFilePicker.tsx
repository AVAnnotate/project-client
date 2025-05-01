import type { CollectionEntry } from 'astro:content';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/themes';
import { useStore } from '@nanostores/react';
import { $pagePlayersState, setAvFile } from 'src/store.ts';
import { defaultState } from '@utils/player.ts';

interface Props {
  event: CollectionEntry<'events'>;
  playerId: string;
  file: string;
}

const ComparisonFilePicker: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);

  const playerState = store[props.playerId] || { ...defaultState };

  const avFileUuid = playerState.avFileUuid || props.file;

  return (
    <Select.Root
      onValueChange={(val) => setAvFile(val, props.playerId)}
      value={avFileUuid}
    >
      <Select.Trigger className='w-[280px] h-[38px] rounded border border-gray-200 bg-white flex justify-between items-center px-4'>
        <Select.Value>
          {props.event.data.audiovisual_files[avFileUuid].label}
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className='bg-white w-[280px] rounded border border-gray-200 z-10'
          position='popper'
        >
          <Select.Viewport>
            {Object.keys(props.event.data.audiovisual_files).map(
              (uuid, idx) => {
                return (
                  <Select.Item asChild key={uuid} value={uuid}>
                    <div className='flex items-center h-[44px] p-4 hover:cursor-pointer hover:bg-gray-200'>
                      {idx + 1}.&nbsp;
                      {props.event.data.audiovisual_files[uuid].label}
                    </div>
                  </Select.Item>
                );
              }
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default ComparisonFilePicker;
