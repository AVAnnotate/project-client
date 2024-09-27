import { useStore } from '@nanostores/react';
import { $pagePlayersState } from 'src/store.ts';
import { Field, Label, Switch } from '@headlessui/react';
import { Check2 } from 'react-bootstrap-icons';

export interface AutoscrollSwitchProps {
  playerId: string;
}

const AutoscrollSwitch = (props: AutoscrollSwitchProps) => {
  const { playerId } = props;
  const pagePlayers = useStore($pagePlayersState);
  const handleToggle = () => {
    $pagePlayersState.setKey(playerId, {
      ...pagePlayers[playerId],
      autoScroll: !pagePlayers[playerId].autoScroll,
    });
  };

  return (
    <Field>
      <Label className='font-semibold pr-4'>Auto-scroll</Label>
      <Switch
        checked={pagePlayers[playerId].autoScroll}
        onChange={handleToggle}
        className='relative group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-secondary'
      >
        <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
        {pagePlayers[playerId].autoScroll && (
          <Check2 className='text-white absolute w-4 h-4 left-1.5 top-[5px]' />
        )}
      </Switch>
    </Field>
  );
};

export default AutoscrollSwitch;
