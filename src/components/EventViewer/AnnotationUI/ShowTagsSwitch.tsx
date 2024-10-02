import { useStore } from '@nanostores/react';
import { $pagePlayersState } from 'src/store.ts';
import { Field, Label, Switch } from '@headlessui/react';
import { Check2 } from 'react-bootstrap-icons';

export interface ShowTagsSwitchProps {
  playerId: string;
}

const ShowTagsSwitch = (props: ShowTagsSwitchProps) => {
  const { playerId } = props;
  const pagePlayers = useStore($pagePlayersState);
  const handleToggle = () => {
    $pagePlayersState.setKey(playerId, {
      ...pagePlayers[playerId],
      showTags: !pagePlayers[playerId].showTags,
    });
  };
  return (
    <Field>
      <Label className='font-semibold pr-4'>Show tags</Label>
      <Switch
        checked={pagePlayers[playerId].showTags}
        onChange={handleToggle}
        className='group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-secondary'
      >
        <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
        {pagePlayers[playerId].showTags && (
          <Check2 className='text-white absolute w-4 h-4 left-1.5 top-[5px]' />
        )}
      </Switch>
    </Field>
  );
};

export default ShowTagsSwitch;
