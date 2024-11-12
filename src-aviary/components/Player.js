import { AviaryIIIFPlayer } from 'aviary-iiif-player';

import './Player.css';

export const Player = (props) => {
  return (
    <div className='player-container'>
      <AviaryIIIFPlayer manifest={props.manifestURL} />
    </div>
  );
};
