import { deepMap } from 'nanostores';

export interface annotationState {
    id: string;
    position: number;
    seekTo?: number;
    isPlaying: boolean;
    autoScroll?: boolean;
    hideTags?: boolean;
    currentAnnotation?: number;
    searchQuery?: string;
    activeFilters?: { category: string, tag: string }[];
    annotationStarts?: {start: number, end?: number}[];
}

//keeps track of all players on the loaded page
export const $pagePlayersState = deepMap<{ [key: string]: annotationState }>({});

