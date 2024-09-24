interface Props {
  color: string;
  tag: string;
  count?: string;
  className?: string;
  onClick?: (...args: any[]) => any;
  icon?: React.FC<any>;
}

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
        className={`rounded-full text-xs flex flex-row justify-center px-3 py-1.5 gap-1 cursor-default ${props.className || ''}`}
        style={{ backgroundColor: props.color }}
        onClick={props.onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={`rounded-full text-xs flex flex-row justify-center px-3 py-1.5 gap-1 cursor-default ${props.className || ''}`}
      style={{ backgroundColor: props.color }}
      onClick={props.onClick}
    >
      {children}
    </div>
  );
};

export default TagPill;
