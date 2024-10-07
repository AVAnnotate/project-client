import OptionToggle from './OptionToggle.tsx';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Gear } from 'react-bootstrap-icons';

interface AnnotationSettingsMenuProps {
  playerId: string;
}

const AnnotationSettingsMenu: React.FC<AnnotationSettingsMenuProps> = (
  props
) => {
  return (
    <Popover>
      <PopoverButton className='bg-white rounded-lg flex flex-row justify-center items-center gap-2 px-2 py-1.5 data-[open]:bg-blue-hover font-semibold'>
        <Gear className='size-4' />
        <span>Settings</span>
      </PopoverButton>
      <PopoverPanel
        anchor='bottom end'
        className='flex flex-col bg-white drop-shadow-lg p-6 rounded-md mt-4 z-50'
      >
        <div className='flex flex-col align-center justify-center gap-4'>
          <OptionToggle
            label='Snap to Annotations'
            playerId={props.playerId}
            property='snapToAnnotations'
            switchPosition='right'
          />
          <OptionToggle
            label='Autoscroll'
            playerId={props.playerId}
            property='autoScroll'
            switchPosition='right'
          />
          <OptionToggle
            label='Show Tags'
            playerId={props.playerId}
            property='showTags'
            switchPosition='right'
          />
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default AnnotationSettingsMenu;
