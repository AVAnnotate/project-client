import ReactPlayer from 'react-player';
import type { default as ReactPlayerType } from 'react-player';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './player.css';
import { Button } from '@radix-ui/themes';
import {
  PauseFill,
  PlayFill,
  VolumeMuteFill,
  VolumeUpFill,
} from 'react-bootstrap-icons';
import * as Slider from '@radix-ui/react-slider';
import { $pagePlayersState, type AnnotationState } from '../../store.ts';
import { useStore } from '@nanostores/react';
import { formatTimestamp } from '../../utils/player.ts';
import type { OnProgressProps } from 'react-player/base';

interface Props {
  end?: number;
  id: string;
  start?: number;
  type: 'Audio' | 'Video';
  url: string;
}

const getSegments = (playerState: AnnotationState): [number, number][] => {
  const annotations =
    playerState.tags.length === 0
      ? playerState.annotations
      : playerState.annotations.filter((ann) =>
          playerState.filteredAnnotations.includes(ann.uuid)
        );

  return annotations.map((ann) => [ann.start_time, ann.end_time]);
};

const Player: React.FC<Props> = (props) => {
  // total length of recording, in seconds
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  const pagePlayers = useStore($pagePlayersState);
  const playerState = pagePlayers[props.id];

  const segments = useMemo(() => {
    if (playerState.snapToAnnotations) {
      return getSegments(playerState);
    } else {
      return [];
    }
  }, [playerState]);

  const player = useRef<ReactPlayerType>(null);

  // whether the user is currently seeking
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if (player.current && playerState.seekTo) {
      player.current.seekTo(playerState.seekTo);
    }
  }, [playerState.seekTo]);

  const formattedPosition = useMemo(
    () => formatTimestamp(playerState.position, false),
    [playerState.position]
  );

  const formattedDuration = useMemo(
    () => formatTimestamp(duration, false),
    [duration]
  );

  const onSeek = useCallback(
    (val: number[]) => {
      setSeeking(false);
      if (player.current) {
        player.current.seekTo(val[0] * duration);
      }
    },
    [player, setSeeking]
  );

  // whether a given timestamp has a corresponding annotation
  const isContainedInSegment = useCallback(
    (segments: [number, number][], timestamp: number) => {
      const timestampInt = Math.floor(timestamp);

      const match = segments.find(
        (seg) => timestampInt >= seg[0] && timestampInt <= seg[1]
      );

      return !!match;
    },
    []
  );

  // gets the next valid segment based on a timestamp that doesn't appear within one
  const getNextSegment = useCallback(
    (segments: [number, number][], timestamp: number) => {
      const timestampInt = Math.floor(timestamp);

      // segments are sorted by start time already so we can trust that sorting here
      return segments.find((seg) => seg[0] >= timestampInt);
    },
    []
  );

  // disable annotation playback snapping when the user manually seeks
  useEffect(() => {
    if (playerState.snapToAnnotations && seeking) {
      $pagePlayersState.setKey(props.id, {
        ...playerState,
        snapToAnnotations: false,
      });
    }
  }, [seeking]);

  const onProgress = (data: OnProgressProps) => {
    // don't move the point if the user is currently dragging it
    if (!seeking) {
      // stop playing if we've reached the end of a clip
      if (props.end && data.playedSeconds >= props.end) {
        $pagePlayersState.setKey(props.id, {
          ...playerState,
          isPlaying: false,
          position: data.playedSeconds,
        });
      } else if (
        playerState.snapToAnnotations &&
        !isContainedInSegment(segments, data.playedSeconds)
      ) {
        // skip forward to the next segment if we've moved out of one
        const nextSegment = getNextSegment(segments, data.playedSeconds);

        $pagePlayersState.setKey(props.id, {
          ...playerState,
          isPlaying: false,
        });

        // if there's no next segment, leave the player paused (i.e. we've reached the end)
        if (nextSegment) {
          // leave a short (500ms) pause between segments
          setTimeout(() => {
            $pagePlayersState.setKey(props.id, {
              ...playerState,
              seekTo: nextSegment[0],
              position: nextSegment[0],
              isPlaying: true,
            });
          }, 500);
        }
      } else {
        $pagePlayersState.setKey(props.id, {
          ...playerState,
          position: data.playedSeconds,
        });
      }
    }
  };

  return (
    <div className='player'>
      <ReactPlayer
        controls={props.type === 'Video'}
        playing={playerState.isPlaying}
        muted={muted}
        onDuration={(dur) => {
          if (props.start && props.end) {
            setDuration(props.end - props.start);
          } else if (props.start) {
            setDuration(dur - props.start);
          } else if (props.end) {
            setDuration(props.end);
          } else {
            setDuration(dur);
          }
        }}
        onProgress={onProgress}
        progressInterval={250}
        ref={player}
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
                  ...playerState,
                  isPlaying: !playerState.isPlaying,
                });
              }}
            >
              {playerState.isPlaying ? (
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
                    ...playerState,
                    position: val[0] * duration,
                  });
                }}
                onValueCommit={onSeek}
                step={0.0001}
                value={[playerState.position / duration]}
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
