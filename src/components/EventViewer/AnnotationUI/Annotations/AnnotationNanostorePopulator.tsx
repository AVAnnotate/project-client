import type { DisplayedAnnotation } from '@ty/index.ts';
import { $pagePlayersState } from 'src/store.ts';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';

// This component's only purpose is to populate the
// list of annotations in the nanostore.

interface Props {
  annotations: DisplayedAnnotation[];
  playerId: string;
  file: string;
}

const AnnotationNanostorePopulator: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);
  const playerState = store[props.playerId];

  useEffect(() => {
    if (playerState?.avFileUuid === props.file) {
      $pagePlayersState.setKey(props.playerId, {
        ...playerState,
        annotations: [...props.annotations],
        filteredAnnotations: [
          ...props.annotations
            .filter((ann) => ann.file === props.file)
            .map((ann) => ann.uuid),
        ],
        avFileUuid: props.file,
      });
    }
  }, [props.annotations, props.playerId, props.file, playerState?.avFileUuid]);

  return <></>;
};

export default AnnotationNanostorePopulator;
