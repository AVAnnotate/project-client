import type { DisplayedAnnotation } from '@ty/index.ts';
import { $pagePlayersState } from 'src/store.ts';
import { useEffect } from 'react';

// This component's only purpose is to populate the
// list of annotations in the nanostore.

interface Props {
  annotations: DisplayedAnnotation[];
  playerId: string;
  initialFile: string;
}

const AnnotationNanostorePopulator: React.FC<Props> = (props) => {
  useEffect(() => {
    const state = $pagePlayersState.get()[props.playerId];

    $pagePlayersState.setKey(props.playerId, {
      ...state,
      annotations: [...props.annotations],
      filteredAnnotations: [
        ...props.annotations
          .filter((ann) => ann.file === props.initialFile)
          .map((ann) => ann.uuid),
      ],
      avFileUuid: props.initialFile,
    });
  }, [props.annotations, props.playerId]);

  return <></>;
};

export default AnnotationNanostorePopulator;
