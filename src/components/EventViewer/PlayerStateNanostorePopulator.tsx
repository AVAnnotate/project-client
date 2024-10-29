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
  useEffect(() => {
    const state = $pagePlayersState.get()[props.playerId];

    $pagePlayersState.setKey(props.playerId, {
      ...state,
      isEmbed: props.isEmbed,
      avFileUuid: props.initialFile,
    });
  }, [props.playerId, props.isEmbed]);

  return <></>;
};

export default PlayerStateNanostorePopulator;
