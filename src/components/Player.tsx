// react-player requires a weird workaround to keep TS from complaining
import { default as _ReactPlayer } from 'react-player';
import type { ReactPlayerProps } from 'react-player/types/lib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import '../style/player.css';
import { Button } from '@radix-ui/themes';
import {
  PauseFill,
  PlayFill,
  VolumeMuteFill,
  VolumeUpFill,
} from 'react-bootstrap-icons';
import * as Slider from '@radix-ui/react-slider';
import { $pagePlayersState } from '../store.ts';
import { useStore } from '@nanostores/react';
import { formatTimestamp } from '../utils/player.ts';

interface Props {
  url: string;
  // optional props for controlling the
  // player from a parent component
  playing?: boolean;
  id: string;
  type: 'Audio' | 'Video';
}

const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;

const Player: React.FC<Props> = (props) => {
  // total length of recording, in seconds
  const [duration, setDuration] = useState(0);

  const [muted, setMuted] = useState(false);

  const pagePlayers = useStore($pagePlayersState);
  const thisPlayerState = useMemo(
    () => pagePlayers[props.id],
    [pagePlayers[props.id], props.id]
  );

  // store the player itself in state instead of a ref
  // because there's something weird in their packaging
  // that breaks ref-based calls
  const [player, setPlayer] = useState<any>(null);

  // whether the user is currently seeking
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if (player) {
      player.seekTo(thisPlayerState.seekTo);
    }
  }, [thisPlayerState.seekTo]);

  useEffect(() => {
    if (props.playing) {
      $pagePlayersState.setKey(props.id, {
        ...thisPlayerState,
        isPlaying: props.playing,
      });
    }
  }, [props.playing]);

  const formattedPosition = useMemo(
    () => formatTimestamp(thisPlayerState.position),
    [thisPlayerState.position]
  );

  const formattedDuration = useMemo(
    () => formatTimestamp(duration),
    [duration]
  );

  const onSeek = useCallback(
    (val: number[]) => {
      setSeeking(false);
      if (player) {
        player.seekTo(val[0] * duration);
      }
    },
    [player, setSeeking]
  );

  return (
    <div className='player'>
      <ReactPlayer
        controls={props.type === 'Video'}
        playing={thisPlayerState.isPlaying}
        played={thisPlayerState.position / duration || 0}
        muted={muted}
        onDuration={(dur) => setDuration(dur)}
        onProgress={(data) => {
          // don't move the point if the user is currently dragging it
          if (!seeking) {
            $pagePlayersState.setKey(props.id, {
              ...thisPlayerState,
              position: data.playedSeconds,
            });
          }
        }}
        onReady={(player) => setPlayer(player)}
        progressInterval={50}
        url={props.url}
        height={props.type === 'Video' ? '100%' : 0}
        width={props.type === 'Video' ? '100%' : 0}
      />
      {props.type === 'Audio' && (
        <div className='player-control-panel !bg-gray-200'>
          <div className='content'>
            <Button
              className='audio-button unstyled'
              onClick={() => {
                $pagePlayersState.setKey(props.id, {
                  ...thisPlayerState,
                  isPlaying: !thisPlayerState.isPlaying,
                });
              }}
            >
              {thisPlayerState.isPlaying ? (
                <PauseFill color='black' />
              ) : (
                <PlayFill color='black' />
              )}
            </Button>
            <div className='position-label'>
              <span className='timestamp position'>{formattedPosition}</span>
              <span>&nbsp;/&nbsp;</span>
              <span className='timestamp duration'>{formattedDuration}</span>
            </div>
            <div className='seek-bar'>
              <Slider.Root
                className='seek-bar-slider'
                defaultValue={[0]}
                min={0}
                max={0.999999999}
                onValueChange={(val) => {
                  setSeeking(true);
                  $pagePlayersState.setKey(props.id, {
                    ...thisPlayerState,
                    position: val[0] * duration,
                  });
                }}
                onValueCommit={onSeek}
                step={0.0001}
                value={[thisPlayerState.position / duration]}
              >
                <Slider.Track className='seek-bar-slider-track !bg-gray-400'>
                  <Slider.Range className='seek-bar-slider-range' />
                </Slider.Track>
                <Slider.Thumb className='seek-bar-slider-thumb' />
              </Slider.Root>
            </div>
            <Button
              className='audio-button unstyled'
              onClick={() => setMuted(!muted)}
            >
              {muted ? (
                <VolumeMuteFill color='black' />
              ) : (
                <VolumeUpFill color='black' />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
