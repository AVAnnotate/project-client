export interface TagFilterProps {
  playerId: string;
  tags: { [key: string]: { tags: string[]; color: string } };
}

const TagFilter = (props: TagFilterProps) => {
  return <div></div>;
};

export default TagFilter;
