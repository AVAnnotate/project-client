import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { Transition } from '@headlessui/react';
import type { PageCollectionEntry } from 'src/utils/pages.ts';

interface SidebarProps {
  baseUrl: string;
  pages: PageCollectionEntry[];
  slug?: string;
  url: URL;
}

const getHref = (page: PageCollectionEntry, baseUrl: string) => {
  if (page.data.autogenerate.type === 'home') {
    return `/${baseUrl}`;
  }

  if (page.data.autogenerate.enabled) {
    return `/${baseUrl}/events/${page.data.slug || page.id}`;
  }

  return `/${baseUrl}/pages/${page.data.slug || page.id}`;
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [show, setShow] = useState(false);

  const homeUuid = useMemo(
    () => props.pages.find((p) => p.data.autogenerate.type === 'home')?.id,
    [props.pages]
  );

  const isIndex = useMemo(
    () => `/${props.baseUrl}/tags` === props.url.pathname,
    [props.baseUrl, props.url]
  );

  // highlight the current page
  // if there's no page slug, that means we're on the homepage
  const isSelected = (page: PageCollectionEntry) => {
    // the index has its own check below
    if (isIndex) {
      return false;
    }

    if (!props.slug && page.id === homeUuid) {
      return true;
    }

    return props.slug && props.slug === page.data.slug;
  };

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
        <div className='shadow absolute top-0 left-0 h-dvh w-80 bg-white w-10 transition duration-200 ease-in-out data-[closed]:-translate-x-full text-black text-sm overflow-y-auto'>
          <div className='flex w-full h-24 justify-end px-8'>
            <button type='button' onClick={() => setShow(false)}>
              <XMarkIcon className='w-8 h-8' />
            </button>
          </div>
          {props.pages.map((page) => (
            <a href={getHref(page, props.baseUrl)} key={page.id}>
              <div className='p-4 hover:bg-blue-hover'>
                <p
                  key={page.id}
                  className={`${isSelected(page) ? 'font-bold' : ''} ${
                    page.data.parent ? 'ml-6' : ''
                  }`}
                  title={page.data.title}
                >
                  {page.data.title}
                </p>
              </div>
            </a>
          ))}
          <a href={`/${props.baseUrl}/tags`}>
            <div className='p-4 hover:bg-blue-hover'>
              <p className={isIndex ? 'font-bold' : ''}>Index</p>
            </div>
          </a>
        </div>
      </Transition>
    </>
  );
};

export default Sidebar;
