import { Input } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useStore } from '@nanostores/react';
import { defaultState } from '@utilsplayer.ts';
import { $pagePlayersState, setSearchFilter } from 'src/store.ts';

export interface TextSearchProps {
  playerId: string;
}

const TextSearch = (props: TextSearchProps) => {
  const { playerId } = props;
  const pagePlayers = useStore($pagePlayersState);

  const playerState = pagePlayers[playerId] || { ...defaultState };

  const handleChange = (e: any) => {
    setSearchFilter(e.target.value, playerId);
  };

  return (
    <div className='flex flex-row grow rounded-lg py-1.5 px-3 bg-white items-center gap-3 border-solid border border-gray-200'>
      <MagnifyingGlassIcon className='h-6 w-6' />
      <Input
        value={playerState.searchQuery}
        onChange={handleChange}
        placeholder='Search'
        className='focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
      ></Input>
    </div>
  );
};

export default TextSearch;
