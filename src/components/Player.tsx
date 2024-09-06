// react-player requires a weird workaround to keep TS from complaining
import { default as _ReactPlayer } from 'react-player';
import t from '../i18n/translations.json';
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
import { CopyIcon } from '@radix-ui/react-icons';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { $pagePlayersState } from '../store.ts';
import { useStore } from '@nanostores/react';
import { formatTimestamp } from '../utils/player.ts';

interface Props {
  url: string;
  // optional props for controlling the
  // player from a parent component
  playing?: boolean;
  position?: number;
  id: string;
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
    // we need to use typeof here instead of a null
    // check because 0 is falsy!
    if (player && typeof props.position === 'number') {
      player.seekTo(props.position);
    }
  }, [props.position]);

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

  const handleCopy = useCallback((val: string) => {
    navigator.clipboard.writeText(val);
  }, []);

  return (
    <div>
      {/* the player doesn't have any UI when playing audio files, so let's keep it 0x0 */}
      {/* when we add video support, we'll need to conditionally set the width/height */}
      <ReactPlayer
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
        width={0}
        height={0}
      />
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
          <div>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    className='unstyled copy-button'
                    onClick={() => handleCopy(formattedPosition)}
                  >
                    <CopyIcon />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content
                  className='tooltip-content !bg-gray-200'
                  side='bottom'
                >
                  {t['Copy timestamp']}
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
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
    </div>
  );
};

export default Player;
