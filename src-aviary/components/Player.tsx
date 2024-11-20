// @ts-ignore
import AV from 'aviary-iiif-player';

import './Player.css';
const { AviaryIIIFPlayer } = AV;

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
