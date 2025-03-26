import {
  Root,
  Trigger,
  Portal,
  Content,
  Close,
  Arrow,
} from '@radix-ui/react-popover';
import { XLg } from 'react-bootstrap-icons';

import './Popover.css';

interface PopupWindowProps {
  count: number;
  children: any[];
}

export const PopupWindow = (props: PopupWindowProps) => {
  if (props.count === 0) {
    return <div />;
  }
  return (
    <Root>
      <Trigger
        asChild
        className='popup-window-trigger cursor-pointer text-black hover:bg-blue-hover'
      >
        <button className='tag-pill rounded-full flex flex-row justify-center px-3 py-1 gap-1 cursor-default border-solid border border-black font-bold text-sm'>
          {`+ ${props.count}`}
        </button>
        {/* <div className='flex flex-row items-center font-bold'>{`+ ${props.count}`}</div> */}
      </Trigger>
      <Portal>
        <Content
          className='flex flex-row flex-wrap popup-window-content border-gray-400 border-solid border rounded-md gap-[6px] w-[400px] mr-[10px] bg-white p-[10px] outline-0'
          sideOffset={5}
        >
          {props.children}
          <Arrow />
        </Content>
      </Portal>
    </Root>
  );
};
