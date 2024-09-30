import { deepMap } from 'nanostores';

export interface AnnotationState {
  id: string;
  position: number;
  seekTo?: number;
  isPlaying: boolean;
  autoScroll?: boolean;
  showTags?: boolean;
  currentAnnotation?: number;
  searchQuery?: string;
  activeFilters?: { category: string; tag: string }[];
  annotationStarts?: { start: number; end?: number }[];
  sets: string[];
  avFileUuid: string;
}

// keeps track of all players on the loaded page
export const $pagePlayersState = deepMap<{ [key: string]: AnnotationState }>(
  {}
);
