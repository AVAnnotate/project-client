import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { Transition } from '@headlessui/react';
import type {
  PageCollectionEntry,
  ProjectCollectionEntry,
} from 'src/utils/pages.ts';
import { normalizeBasePath } from 'src/utils/basePath';

interface SidebarProps {
  basePath: string;
  pages: PageCollectionEntry[];
  project: ProjectCollectionEntry;
  slug?: string;
  url: URL;
}

const getHref = (page: PageCollectionEntry, normalizedBasePath: string) => {
  if (page.data.autogenerate.type === 'home') {
    return normalizedBasePath === '' ? '/' : `${normalizedBasePath}/`;
  }

  if (page.data.autogenerate.enabled) {
    return `${normalizedBasePath}/events/${page.data.slug || page.id}`;
  }

  return `${normalizedBasePath}/pages/${page.data.slug || page.id}`;
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [show, setShow] = useState(false);
  const basePath = normalizeBasePath(props.basePath);

  const homeUuid = useMemo(
    () => props.pages.find((p) => p.data.autogenerate.type === 'home')?.id,
    [props.pages]
  );

  const isIndex = useMemo(
    () => `${basePath}/tags` === props.url.pathname,
    [basePath, props.url]
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

    return (
      props.slug && (props.slug === page.data.slug || props.slug === page.id)
    );
  };

  return (
    <>
      <button onClick={() => setShow(!show)} type='button'>
        <Bars3Icon
          className='w-8 h-8'
          aria-label='expand contract table of contents'
        />
      </button>
      {/* adds the ability to hide the sidebar by clicking outside it */}
      {show && (
        <div
          className='absolute top-0 left-0 h-dvh w-dvw'
          onClick={() => setShow(false)}
        />
      )}
      <Transition show={show}>
        <div className='shadow absolute top-0 left-0 h-[calc(100dvh_-_78px)] w-80 bg-white transition duration-200 ease-in-out data-[closed]:-translate-x-full text-black text-sm overflow-y-auto'>
          <div className='flex w-full h-24 justify-end px-8'>
            <button type='button' onClick={() => setShow(false)}>
              <XMarkIcon className='w-8 h-8' />
            </button>
          </div>
          {props.pages.map((page) => (
            <a href={getHref(page, basePath)} key={page.id}>
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
          {props.project.data.project.tags &&
            props.project.data.project.tags.tags.length > 0 && (
              <a href={`${basePath}/tags`}>
                <div className='p-4 hover:bg-blue-hover'>
                  <p className={isIndex ? 'font-bold' : ''}>Index</p>
                </div>
              </a>
            )}
        </div>
      </Transition>
    </>
  );
};

export default Sidebar;
