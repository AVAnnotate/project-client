// @ts-ignore
import Everything from 'aviary-iiif-player';

import './Player.css';

interface PlayerProps {
  manifestURL: string;
}
export const Player = (props: PlayerProps) => {
  return (
    <div className='player-container'>
      <Everything.AviaryIIIFPlayer manifest={props.manifestURL} />
    </div>
  );
};
