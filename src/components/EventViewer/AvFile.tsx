import { useStore } from '@nanostores/react';
import { defaultState } from '@utilsplayer.ts';
import type { CollectionEntry } from 'astro:content';
import { $pagePlayersState } from 'src/store.ts';
import React from 'react';
import AvFileDisplay from './AvFileDisplay.astro';

interface Props {
  audioComponent: any;
  componentProps: any;
  children: any;
  event: CollectionEntry<'events'>;
  playerId: string;
  videoComponent: any;
}

const AvFile: React.FC<Props> = (props) => {
  const store = useStore($pagePlayersState);

  const playerState = store[props.playerId] || { ...defaultState };

  const children = React.Children.toArray(props.children);
  const firstChild = children[0];
  const secondChild = children[1];

  const fileType =
    props.event.data.audiovisual_files[playerState.avFileUuid]?.file_type;

  // if (fileType === 'Audio') {
  //   return <>{props.children[0]}</>;
  //   return <props.audioComponent {...props.componentProps} />;
  // } else {
  //   return <>{props.children[1]}</>;
  //   return <props.videoComponent {...props.componentProps} />;
  // }

  // this renders both
  return <div>{children[0]}</div>;
};

export default AvFile;
