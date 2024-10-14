interface Props {
  // color can be a hex code or a Tailwind color name
  color: string;
  tag: string;
  count?: string;
  className?: string;
  onClick?: (...args: any[]) => any;
  icon?: React.FC<any>;
}

const isHexCode = (str: string) => /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(str);

const TagPill: React.FC<Props> = (props) => {
  const children = (
    <>
      {props.icon && <props.icon className='size-4' />}
      <span className='font-semibold'>{props.tag}</span>
      {props.count ? <span>{props.count}</span> : null}
    </>
  );

  // use buttons instead of divs if they're clickable for a11y
  if (props.onClick) {
    return (
      <button
        className={`${isHexCode(props.color) ? '' : `bg-${props.color}`} rounded-full text-xs flex flex-row justify-center px-3 py-1.5 gap-1 cursor-default ${props.className || ''}`}
        style={{
          backgroundColor: isHexCode(props.color) ? props.color : undefined,
        }}
        onClick={props.onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={`${isHexCode(props.color) ? '' : `bg-${props.color}`} rounded-full text-xs flex flex-row justify-center px-3 py-1.5 gap-1 cursor-default ${props.className || ''}`}
      style={{
        backgroundColor: isHexCode(props.color) ? props.color : undefined,
      }}
      onClick={props.onClick}
    >
      {children}
    </div>
  );
};

export default TagPill;
