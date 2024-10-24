import { useStore } from '@nanostores/react';
import { $pagePlayersState } from 'src/store.ts';
import { useEffect } from 'react';

// This component's only purpose is to populate the
// player state in the nanostore.

interface Props {
  playerId: string;
  isEmbed?: boolean;
  initialFile: string;
}

const PlayerStateNanostorePopulator: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);

  useEffect(() => {
    $pagePlayersState.setKey(props.playerId, {
      ...store[props.playerId],
      isEmbed: props.isEmbed,
      avFileUuid: props.initialFile,
    });
  }, [props.playerId, props.isEmbed]);

  return <></>;
};

export default PlayerStateNanostorePopulator;
