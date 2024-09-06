import { useStore } from '@nanostores/react';
import { $pagePlayersState } from 'src/store.ts';
import { Field, Label, Switch } from '@headlessui/react';

export interface HideTagsSwitchProps {
  playerId: string;
}

const HideTagsSwitch = (props: HideTagsSwitchProps) => {
  const { playerId } = props;
  const pagePlayers = useStore($pagePlayersState);
  const handleToggle = () => {
    $pagePlayersState.setKey(playerId, {
      ...pagePlayers[playerId],
      hideTags: !pagePlayers[playerId].hideTags,
    });
  };
  return (
    <Field>
      <Label className='font-semibold pr-4'>Hide tags</Label>
      <Switch
        checked={pagePlayers[playerId].hideTags}
        onChange={handleToggle}
        className='group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-secondary'
      >
        <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
      </Switch>
    </Field>
  );
};

export default HideTagsSwitch;
