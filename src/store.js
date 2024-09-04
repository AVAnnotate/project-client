import { atom } from 'nanostores';

//what do we we need to keep track of?

//which player is currently playing/active? (media file ID as ID)
export const $activePlayer = atom('');

//self-explanatory
export const $isPlaying = atom(false);

//current location of player
export const $position = atom(0);

//use to indicate jumps from e.g. clicking on an annotation box
export const $seekTo = atom(0);
