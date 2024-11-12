// @ts-ignore
import Aviary from 'aviary-iiif-player';

import './Player.css';

interface PlayerProps {
  manifestURL: string;
}
export const Player = (props: PlayerProps) => {
  return (
    <div className='player-container'>
      <Aviary manifest={props.manifestURL} />
    </div>
  );
};
