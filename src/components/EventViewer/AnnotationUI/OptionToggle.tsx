import { useStore } from '@nanostores/react';
import { $pagePlayersState } from 'src/store.ts';
import type { AnnotationState } from 'src/store.ts';
import { Field, Label, Switch } from '@headlessui/react';
import { Check2 } from 'react-bootstrap-icons';

// This fancy type allows us to restrict the property prop below
// to only annotation state properties that contain boolean values.
// This way, we don't need to update this component's prop types when
// we add a new property to the annotation state.
type OnlyBooleans<T> = {
  [K in keyof T as T[K] extends boolean ? K : never]: T[K];
};

interface OptionToggleProps {
  playerId: string;
  property: keyof OnlyBooleans<AnnotationState>;
  label: string;
}

const OptionToggle: React.FC<OptionToggleProps> = (props) => {
  const pagePlayers = useStore($pagePlayersState);

  const handleToggle = () => {
    $pagePlayersState.setKey(props.playerId, {
      ...pagePlayers[props.playerId],
      [props.property]: !pagePlayers[props.playerId][props.property],
    });
  };

  return (
    <Field>
      <Label className='font-semibold pr-4 text-md'>{props.label}</Label>
      <Switch
        checked={pagePlayers[props.playerId][props.property]}
        onChange={handleToggle}
        className='group relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-secondary'
      >
        <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
        {pagePlayers[props.playerId][props.property] && (
          <Check2 className='text-white absolute w-4 h-4 left-1.5 top-[5px]' />
        )}
      </Switch>
    </Field>
  );
};

export default OptionToggle;
