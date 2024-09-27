// @ts-ignore
import { AviaryIIIFPlayer as Everything } from 'aviary-iiif-player';

import './Player.css';

interface PlayerProps {
  manifestURL: string;
}
export const Player = (props: PlayerProps) => {
  return (
    <div className='player-container'>
      <Everything manifest={props.manifestURL} />
    </div>
  );
};
