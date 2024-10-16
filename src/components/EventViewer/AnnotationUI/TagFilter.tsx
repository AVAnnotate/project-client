import TagPill from '@components/Tags/TagPill.tsx';
import {
  Checkbox,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import {
  AdjustmentsVerticalIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '@nanostores/react';
import type { CollectionEntry } from 'astro:content';
import React, { useMemo } from 'react';
import {
  $pagePlayersState,
  clearFilter,
  toggleCategoryFilter,
  toggleSetFilter,
  toggleTagFilter,
} from 'src/store.ts';

export interface TagFilterProps {
  playerId: string;
  projectData: CollectionEntry<'project'>;
  annotationSets: CollectionEntry<'annotations'>[];
}

const TagFilter = (props: TagFilterProps) => {
  const { playerId } = props;
  const playerState = useStore($pagePlayersState);
  const thisPlayer = useMemo(
    () => playerState[playerId],
    [playerState, playerId]
  );

  const tagGroups = props.projectData.data.project.tags.tagGroups;

  const allTags = useMemo(() => {
    const tagsObj: { [key: string]: { tags: string[]; color: string } } = {};

    const setsToShow =
      thisPlayer.sets.length > 0
        ? props.annotationSets.filter((set) => thisPlayer.sets.includes(set.id))
        : props.annotationSets;

    setsToShow.forEach((set) => {
      set?.data.annotations.forEach((ann) => {
        if (ann.tags && ann.tags.length) {
          ann.tags.forEach((tag: { category: string; tag: string }) => {
            const cat = tag.category.toLowerCase();
            tagsObj[cat] ||= {
              tags: [],
              color:
                tagGroups.find((grp) => grp.category.toLowerCase() === cat)
                  ?.color || '#FFF',
            };
            if (!tagsObj[cat].tags.includes(tag.tag)) {
              tagsObj[cat].tags.push(tag.tag);
              tagsObj[cat].tags.sort();
            }
          });
        }
      });
    });

    return tagsObj;
  }, [thisPlayer.sets]);

  const categories = Object.keys(allTags);

  return (
    <Popover>
      <PopoverButton className='bg-white rounded-lg flex flex-row justify-center items-center gap-2 px-2 py-1.5 data-[open]:bg-blue-hover font-semibold'>
        <AdjustmentsVerticalIcon className='size-4' />
        <span>Filter</span>
        {(thisPlayer.tags.length > 0 || thisPlayer.sets.length > 0) && (
          <div className='rounded-2xl px-1.5 py-0.5 flex items-center justify-center text-white bg-primary text-xs'>
            {thisPlayer.tags.length + thisPlayer.sets.length}
          </div>
        )}
      </PopoverButton>
      <PopoverPanel
        anchor='bottom end'
        className='flex flex-col w-[400px] bg-white drop-shadow-lg p-6 rounded-md mt-4'
      >
        <p className='text-md font-semibold mb-4'>Filters</p>
        <div className='flex flex-row justify-between w-full pb-2'>
          {props.annotationSets.length > 1 && (
            <div className='w-full pb-2'>
              <div className='flex flex-row justify-between w-full pb-2'>
                <p className='text-sm font-semibold'>Annotation Sets</p>
                {thisPlayer.sets.length > 0 && (
                  <div className='bg-primary rounded-lg flex items-center justify-center gap-2 py-1 px-2 text-white cursor-default text-xs font-semibold'>
                    <p>{`${thisPlayer.sets.length} filter${thisPlayer.sets.length > 1 ? 's' : ''} applied`}</p>
                    <XMarkIcon
                      className='size-4 text-white hover:scale-105 cursor-pointer'
                      onClick={() => clearFilter('sets', playerId)}
                    />
                  </div>
                )}
              </div>
              {props.annotationSets.map((set) => (
                <div className='block' key={set.id}>
                  <div className='flex flex-row gap-3 py-1'>
                    <Checkbox
                      checked={
                        thisPlayer.sets && thisPlayer.sets.includes(set.id)
                      }
                      onChange={() => {
                        toggleSetFilter(set.id, playerId);
                      }}
                      className='group size-4 bg-white rounded-sm data-[checked]:bg-primary p-0.5 ring-1 ring-gray-300 ring-inset data-[checked]:ring-primary'
                    >
                      <CheckIcon className='hidden size-3 group-data-[checked]:block text-white' />
                    </Checkbox>
                    <p className='capitalize font-semibold text-xs'>
                      {set.data.set.replaceAll('_', '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='flex flex-row justify-between w-full pb-2'>
          <p className='text-sm  font-semibold'>Tags</p>
          {thisPlayer.tags.length > 0 && (
            <div className='bg-primary rounded-lg flex items-center justify-center gap-2 py-1 px-2 text-white cursor-default text-xs font-semibold'>
              <p>{`${thisPlayer.tags.length} filter${thisPlayer.tags.length > 1 ? 's' : ''} applied`}</p>
              <XMarkIcon
                className='size-4 text-white hover:scale-105 cursor-pointer'
                onClick={() => clearFilter('tags', playerId)}
              />
            </div>
          )}
        </div>
        {thisPlayer &&
          categories.map((cat, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 ? (
                <div className='h-[1px] bg-gray-200 w-full my-3' />
              ) : null}
              <div className='flex flex-col gap-2' key={idx}>
                <div className='flex flex-row gap-3 py-1'>
                  <Checkbox
                    checked={
                      thisPlayer.tags &&
                      thisPlayer.tags.filter(
                        (tag) =>
                          tag.category.toLowerCase() === cat.toLowerCase()
                      ).length === allTags[cat].tags.length
                    }
                    onChange={() => {
                      toggleCategoryFilter(cat, allTags, playerId);
                    }}
                    className='group size-4 bg-white rounded-sm data-[checked]:bg-primary p-0.5 ring-1 ring-gray-300 ring-inset data-[checked]:ring-primary'
                  >
                    <CheckIcon className='hidden size-3 group-data-[checked]:block text-white' />
                  </Checkbox>
                  <p className='capitalize font-semibold text-xs'>
                    {cat.replaceAll('_', '')}
                  </p>
                </div>
                <div className='flex flex-row gap-2 flex-wrap'>
                  {allTags[cat].tags.map((tag, idx) => (
                    <TagPill
                      color={allTags[cat].color}
                      key={idx}
                      tag={tag}
                      icon={
                        thisPlayer.tags &&
                        thisPlayer.tags?.findIndex(
                          (t) => t.category == cat && t.tag == tag
                        ) !== -1
                          ? CheckIcon
                          : undefined
                      }
                      className={
                        thisPlayer.tags &&
                        thisPlayer.tags?.findIndex(
                          (t) => t.category === cat && t.tag === tag
                        ) !== -1
                          ? 'outline outline-1 outline-black'
                          : ''
                      }
                      onClick={() => {
                        toggleTagFilter({ category: cat, tag }, playerId);
                      }}
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
      </PopoverPanel>
    </Popover>
  );
};

export default TagFilter;
