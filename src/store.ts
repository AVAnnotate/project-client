import type { DisplayedAnnotation, Tag } from '@ty/index.ts';
import { deepMap } from 'nanostores';
import { Node } from 'slate';

export interface AnnotationState {
  id: string;
  position: number;
  seekTo?: number;
  isPlaying?: string;
  autoScroll: boolean;
  showTags: boolean;
  currentAnnotation?: number;
  searchQuery?: string;
  tags: Tag[];
  annotationStarts?: {
    start: number;
    end?: number;
    playerId: string;
    uuid: string;
  }[];
  sets: string[];
  avFileUuid: string;
  annotations: DisplayedAnnotation[];
  filteredAnnotations: string[];
  snapToAnnotations: boolean;
  clip?: {
    start: number;
    end: number;
  };
  isEmbed?: boolean;
}

// keeps track of all players on the loaded page
export const $pagePlayersState = deepMap<{ [key: string]: AnnotationState }>(
  {}
);

const getFilteredAnnotations = (
  newState: AnnotationState,
  playerId: string
) => {
  const result = newState.annotations.filter((ann) => {
    // hide if its AV file is hidden
    if (newState.avFileUuid && ann.file !== newState.avFileUuid) {
      return false;
    }

    // hide if its set is hidden
    if (newState.sets.length > 0) {
      const setFiltersEmpty = newState.sets.length === 0;

      if (ann.set && !setFiltersEmpty && !newState.sets.includes(ann.set)) {
        return false;
      }
    }

    // hide if its tags are hidden
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

    // hide if it's not in the selected clip
    if (newState.clip) {
      // should show if any part of the annotation overlaps with the selected clip,
      // even if it's partly outside the clip
      const startTimeMatch =
        ann.start_time >= newState.clip.start &&
        ann.start_time <= newState.clip.end;
      const endTimeMatch =
        ann.end_time >= newState.clip.start &&
        ann.end_time <= newState.clip.end;

      if (!startTimeMatch && !endTimeMatch) {
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
  });

  const annotationStarts = result.map((ann) => ({
    start: ann.start_time,
    end: ann.end_time || undefined,
    playerId: playerId,
    uuid: ann.uuid,
  }));

  return {
    filteredAnnotations: result.map((r) => r.uuid),
    annotationStarts,
  };
};

const getNewSnapState = (
  oldState: AnnotationState,
  newState: AnnotationState
) => {
  // disable annotation playback snapping when the user disables all tag filters,
  // and enable it if the user has just enabled their first tag filter
  if (newState.tags.length === 0) {
    return false;
  } else if (oldState.tags.length === 0 && newState.tags.length > 0) {
    return true;
  }

  // otherwise, keep the previous value
  return newState.snapToAnnotations;
};

export const toggleTagFilter = (tag: Tag, playerId: string) => {
  const oldState = $pagePlayersState.get()[playerId];

  const current = oldState.tags || [];
  const updated = current?.find(
    (t) => t.category === tag.category && t.tag === tag.tag
  )
    ? current.filter((t) => t.category !== tag.category || t.tag !== tag.tag)
    : [...current, tag];

  const newState = {
    ...oldState,
    tags: updated,
  };

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;

  newState.snapToAnnotations = getNewSnapState(oldState, newState);

  $pagePlayersState.setKey(playerId, newState);
};

export const toggleCategoryFilter = (
  category: string,
  allTags: { [key: string]: { tags: any[] } },
  playerId: string
) => {
  const oldState = $pagePlayersState.get()[playerId];

  const current =
    oldState.tags?.filter(
      (tag) => tag.category.toLowerCase() === category.toLowerCase()
    ) || [];

  let newState: AnnotationState;

  if (current.length === allTags[category].tags.length) {
    //in this case, everything in the category is already checked, and we want to uncheck them
    newState = {
      ...oldState,
      tags: oldState.tags?.filter(
        (tag) => tag.category.toLowerCase() !== category.toLowerCase()
      ),
    };
  } else {
    const allCategoryTags = allTags[category].tags.map((tag) => ({
      category: category,
      tag: tag,
    }));
    const active = oldState.tags ? [...oldState.tags] : [];
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
      ...oldState,
      tags: active,
    };
  }

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;
  newState.snapToAnnotations = getNewSnapState(oldState, newState);

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

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;

  $pagePlayersState.setKey(playerId, newState);
};

export const setAvFile = (avFileUuid: string, playerId: string) => {
  const oldState = $pagePlayersState.get()[playerId];

  const newState = {
    ...oldState,
    avFileUuid,
  };

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;

  $pagePlayersState.setKey(playerId, newState);
};

export const setSearchFilter = (searchQuery: string, playerId: string) => {
  const oldState = $pagePlayersState.get()[playerId];

  const newState = {
    ...oldState,
    searchQuery,
  };

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;

  $pagePlayersState.setKey(playerId, newState);
};

export const clearFilter = (type: 'sets' | 'tags', playerId: string) => {
  const oldState = $pagePlayersState.get()[playerId];

  const newState = {
    ...oldState,
    [type]: [],
  };

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;

  if (type === 'tags') {
    newState.snapToAnnotations = false;
  }

  $pagePlayersState.setKey(playerId, newState);
};

export const setClip = (
  clip: { start: number; end: number },
  playerId: string
) => {
  const oldState = $pagePlayersState.get()[playerId];

  const newState = { ...oldState, clip };

  const filtered = getFilteredAnnotations(newState, playerId);
  newState.filteredAnnotations = filtered.filteredAnnotations;
  newState.annotationStarts = filtered.annotationStarts;

  $pagePlayersState.setKey(playerId, newState);
};
