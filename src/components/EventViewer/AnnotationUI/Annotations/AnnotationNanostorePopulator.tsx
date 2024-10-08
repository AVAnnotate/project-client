import type { DisplayedAnnotation } from '@ty/index.ts';
import { useStore } from '@nanostores/react';
import { $pagePlayersState } from 'src/store.ts';
import { useEffect } from 'react';

// This component's only purpose is to populate the
// list of annotations in the nanostore.

interface Props {
  annotations: DisplayedAnnotation[];
  playerId: string;
}

const AnnotationNanostorePopulator: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);

  useEffect(() => {
    $pagePlayersState.setKey(props.playerId, {
      ...store[props.playerId],
      annotations: [...props.annotations],
      filteredAnnotations: [...props.annotations.map((ann) => ann.uuid)],
    });
  }, [props.annotations, props.playerId]);

  return <></>;
};

export default AnnotationNanostorePopulator;
