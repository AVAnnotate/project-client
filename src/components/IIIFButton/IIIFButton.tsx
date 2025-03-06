import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import './IIIFButton.css';

interface IIIFButtonProps {
  options: { label: string; url: string; icon?: any }[];
}

const BASE = import.meta.env.BASE_URL;

export const IIIFButton = (props: IIIFButtonProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          <img
            src='https://iiif.io/assets/images/logos/logo-sm.png'
            alt='IIIF Manifest'
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          {props.options.map((o) => {
            return (
              <DropdownMenu.Item>
                <a href={`${BASE}/manifests/${o.url}.json`}>
                  {o.icon && o.icon}
                  {o.label}
                </a>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
