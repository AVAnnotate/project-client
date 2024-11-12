// @ts-ignore
import { AviaryIIIFPlayer } from 'aviary-iiif-player';

import './Player.css';

interface PlayerProps {
  manifestURL: string;
}
export const Player = (props: PlayerProps) => {
  return (
    <div className='player-container'>
      <AviaryIIIFPlayer manifest={props.manifestURL} />
    </div>
  );
};
