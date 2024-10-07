import type { AnnotationState } from 'src/store.ts';

// returns an array of timestamps for each matching annotation
const useSegments = (playerState: AnnotationState): [number, number][] => {
  const annotations =
    playerState.tags.length === 0
      ? playerState.annotations
      : playerState.annotations.filter((ann) =>
          playerState.filteredAnnotations.includes(ann.uuid)
        );

  return annotations.map((ann) => [ann.start_time, ann.end_time]);
};

export default useSegments;
