import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import type { PageCollectionEntry } from 'src/utils/pages.ts';
import { ArrowReturnRight } from 'react-bootstrap-icons';

interface SidebarProps {
  baseUrl: string;
  pages: PageCollectionEntry[];
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(!show)} type='button'>
        <Bars3Icon className='w-8 h-8' />
      </button>
      {/* adds the ability to hide the sidebar by clicking outside it */}
      {show && (
        <div
          className='absolute top-0 left-0 h-dvh w-dvw'
          onClick={() => setShow(false)}
        />
      )}
      <Transition show={show}>
        <div className='shadow absolute top-0 left-0 h-dvh w-80 bg-white w-10 transition duration-200 ease-in-out data-[closed]:-translate-x-full text-black'>
          <div className='flex w-full h-24 justify-end px-8'>
            <button type='button' onClick={() => setShow(false)}>
              <XMarkIcon className='w-8 h-8' />
            </button>
          </div>
          <div className='flex flex-col gap-6 pb-8 px-8 font-semibold font-inter'>
            {props.pages.map((page) => (
              <p
                key={page.id}
                className='whitespace-nowrap overflow-hidden text-ellipsis'
                title={page.data.title}
              >
                <a
                  href={`/${props.baseUrl}/${page.data.autogenerate.enabled ? 'events' : 'pages'}/${page.id}`}
                >
                  {page.data.parent && (
                    <ArrowReturnRight className='inline mr-2 relative bottom-[2px]' />
                  )}
                  {page.data.title}
                </a>
              </p>
            ))}
          </div>
        </div>
      </Transition>
    </>
  );
};

export default Sidebar;
