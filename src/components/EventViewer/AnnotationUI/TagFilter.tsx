import TagPill from '@components/tags/TagPill.tsx';
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
import React, { useMemo } from 'react';
import { $pagePlayersState } from 'src/store.ts';

export interface TagFilterProps {
  playerId: string;
  tags: { [key: string]: { tags: string[]; color: string } };
}

const TagFilter = (props: TagFilterProps) => {
  const { playerId, tags } = props;
  const categories = Object.keys(tags);
  const playerState = useStore($pagePlayersState);
  const thisPlayer = useMemo(
    () => playerState[playerId],
    [playerState, playerId]
  );

  const toggleTag = (tag: { category: string; tag: string }) => {
    const current = thisPlayer.activeFilters || [];
    const updated = current?.find(
      (t) => t.category === tag.category && t.tag === tag.tag
    )
      ? current.filter((t) => t.category != tag.category || t.tag != tag.tag)
      : [...current, tag];
    $pagePlayersState.setKey(playerId, {
      ...thisPlayer,
      activeFilters: updated,
    });
  };

  const toggleCategory = (category: string) => {
    const current =
      thisPlayer.activeFilters?.filter(
        (tag) => tag.category.toLowerCase() === category.toLowerCase()
      ) || [];
    if (current.length === tags[category].tags.length) {
      //in this case, everything in the category is already checked, and we want to uncheck them
      $pagePlayersState.setKey(playerId, {
        ...thisPlayer,
        activeFilters: thisPlayer.activeFilters?.filter(
          (tag) => tag.category.toLowerCase() != category.toLowerCase()
        ),
      });
    } else {
      const allCategoryTags = tags[category].tags.map((tag) => ({
        category: category,
        tag: tag,
      }));
      const active = thisPlayer.activeFilters
        ? [...thisPlayer.activeFilters]
        : [];
      allCategoryTags.forEach((tag) => {
        if (
          active.findIndex(
            (t) =>
              t.category.toLowerCase() === tag.category.toLowerCase() &&
              t.tag.toLowerCase() === tag.tag.toLowerCase()
          ) === -1
        ) {
          active.push(tag);
        }
      });
      $pagePlayersState.setKey(playerId, {
        ...thisPlayer,
        activeFilters: active,
      });
    }
  };

  return (
    <Popover>
      <PopoverButton className='bg-white rounded-lg flex flex-row justify-center items-center gap-2 px-2 py-1.5 data-[open]:bg-blue-hover font-semibold'>
        <AdjustmentsVerticalIcon className='size-4' />
        <span>Filter</span>
        {thisPlayer.activeFilters && thisPlayer.activeFilters.length ? (
          <div className='rounded-2xl px-1.5 py-0.5 flex items-center justify-center text-white bg-primary text-xs'>
            {thisPlayer.activeFilters.length}
          </div>
        ) : null}
      </PopoverButton>
      <PopoverPanel
        anchor='bottom end'
        className='flex flex-col w-[400px] bg-white drop-shadow-lg p-6 rounded-md mt-4'
      >
        <div className='flex flex-row justify-between w-full pb-2'>
          <p className='text-sm  font-semibold'>Tags</p>
          {thisPlayer.activeFilters && thisPlayer.activeFilters.length ? (
            <div className='bg-primary rounded-lg flex items-center justify-center gap-2 py-1 px-2 text-white cursor-default text-xs font-semibold'>
              <p>{`${thisPlayer.activeFilters.length} filter${thisPlayer.activeFilters.length > 1 ? 's' : ''} applied`}</p>
              <XMarkIcon
                className='size-4 text-white hover:scale-105 cursor-pointer'
                onClick={() => {
                  $pagePlayersState.setKey(playerId, {
                    ...thisPlayer,
                    activeFilters: [],
                  });
                }}
              />
            </div>
          ) : null}
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
                      thisPlayer.activeFilters &&
                      thisPlayer.activeFilters.filter(
                        (tag) =>
                          tag.category.toLowerCase() === cat.toLowerCase()
                      ).length === tags[cat].tags.length
                    }
                    onChange={() => {
                      toggleCategory(cat);
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
                  {tags[cat].tags.map((tag, idx) => (
                    <TagPill
                      color={tags[cat].color}
                      key={idx}
                      tag={tag}
                      icon={
                        thisPlayer.activeFilters &&
                        thisPlayer.activeFilters?.findIndex(
                          (t) => t.category == cat && t.tag == tag
                        ) != -1
                          ? CheckIcon
                          : undefined
                      }
                      className={
                        thisPlayer.activeFilters &&
                        thisPlayer.activeFilters?.findIndex(
                          (t) => t.category === cat && t.tag === tag
                        ) != -1
                          ? 'outline outline-1 outline-black'
                          : ''
                      }
                      onClick={() => {
                        toggleTag({ category: cat, tag: tag });
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
