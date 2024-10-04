import type { DisplayedAnnotation, Tag } from '@ty/index.ts';
import { computed, deepMap } from 'nanostores';
import { Node } from 'slate';

export interface AnnotationState {
  id: string;
  position: number;
  seekTo?: number;
  isPlaying: boolean;
  autoScroll?: boolean;
  showTags?: boolean;
  currentAnnotation?: number;
  searchQuery?: string;
  tags: Tag[];
  annotationStarts?: { start: number; end?: number }[];
  sets: string[];
  avFileUuid: string;
  annotations: DisplayedAnnotation[];
  filteredAnnotations: string[];
}

// keeps track of all players on the loaded page
export const $pagePlayersState = deepMap<{ [key: string]: AnnotationState }>(
  {}
);

const getFilteredAnnotations = (newState: AnnotationState) =>
  newState.annotations
    .filter((ann) => {
      // hide if its set is hidden
      if (newState.sets.length > 0) {
        const setFiltersEmpty = newState.sets.length === 0;

        if (ann.set && !setFiltersEmpty && !newState.sets.includes(ann.set)) {
          return false;
        }
      }

      // hide if its sets are hidden
      if (newState.tags.length > 0) {
        let match = false;

        for (let i = 0; i < ann.tags.length; i++) {
          const tag = ann.tags[i];
          if (
            newState.tags.find(
              (tf) =>
                tf.category.toLowerCase() === tag.category.toLowerCase() &&
                tf.tag.toLowerCase() === tag.tag.toLowerCase()
            )
          ) {
            match = true;
            break;
          }
        }

        if (!match) {
          return false;
        }
      }

      // hide if the search query doesn't include any of its text
      if (newState.searchQuery) {
        const text = ann.annotation
          .map((n) => Node.string(n))
          .join('\n')
          .toLowerCase();

        if (text) {
          const match = text
            .toLowerCase()
            .includes(newState.searchQuery!.toLowerCase());

          if (!match) {
            return false;
          }
        }
      }

      // display the annotation if it passed all the above checks
      return true;
    })
    .map((ann) => ann.uuid);

export const toggleTagFilter = (tag: Tag, playerId: string) => {
  const thisPlayer = $pagePlayersState.get()[playerId];

  const current = thisPlayer.tags || [];
  const updated = current?.find(
    (t) => t.category === tag.category && t.tag === tag.tag
  )
    ? current.filter((t) => t.category !== tag.category || t.tag !== tag.tag)
    : [...current, tag];

  const newState = {
    ...thisPlayer,
    tags: updated,
  };

  newState.filteredAnnotations = getFilteredAnnotations(newState);

  $pagePlayersState.setKey(playerId, newState);
};

export const toggleCategoryFilter = (
  category: string,
  allTags: { [key: string]: { tags: any[] } },
  playerId: string
) => {
  const thisPlayer = $pagePlayersState.get()[playerId];

  const current =
    thisPlayer.tags?.filter(
      (tag) => tag.category.toLowerCase() === category.toLowerCase()
    ) || [];

  let newState: AnnotationState;

  if (current.length === allTags[category].tags.length) {
    //in this case, everything in the category is already checked, and we want to uncheck them
    newState = {
      ...thisPlayer,
      tags: thisPlayer.tags?.filter(
        (tag) => tag.category.toLowerCase() !== category.toLowerCase()
      ),
    };
  } else {
    const allCategoryTags = allTags[category].tags.map((tag) => ({
      category: category,
      tag: tag,
    }));
    const active = thisPlayer.tags ? [...thisPlayer.tags] : [];
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

    newState = {
      ...thisPlayer,
      tags: active,
    };
  }

  newState.filteredAnnotations = getFilteredAnnotations(newState);

  $pagePlayersState.setKey(playerId, newState);
};

export const toggleSetFilter = (set: string, playerId: string) => {
  const thisPlayer = $pagePlayersState.get()[playerId];

  let newState: AnnotationState;

  if (thisPlayer.sets.includes(set)) {
    newState = {
      ...thisPlayer,
      sets: thisPlayer.sets.filter((s) => s !== set),
    };
  } else {
    newState = {
      ...thisPlayer,
      sets: [...thisPlayer.sets, set],
    };
  }

  newState.filteredAnnotations = getFilteredAnnotations(newState);

  $pagePlayersState.setKey(playerId, newState);
};

export const clearFilter = (type: 'sets' | 'tags', playerId: string) => {
  const thisPlayer = $pagePlayersState.get()[playerId];

  const newState = {
    ...thisPlayer,
    [type]: [],
  };

  newState.filteredAnnotations = getFilteredAnnotations(newState);

  $pagePlayersState.setKey(playerId, newState);
};
