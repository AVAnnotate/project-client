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
import {
  $pagePlayersState,
  setClip,
  type AnnotationState,
} from '../../store.ts';
import { useStore } from '@nanostores/react';
import { defaultState, formatTimestamp } from '../../utils/player.ts';
import type { OnProgressProps } from 'react-player/base';
import type { CollectionEntry } from 'astro:content';

interface Props {
  end?: number;
  id: string;
  start?: number;
  vttURLs?: { url: string; label: string }[];
  initialFile: string;
  event: CollectionEntry<'events'>;
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
  const playerState = pagePlayers[props.id] || { ...defaultState };

  const fileUrl = useMemo(() => {
    // initial value for SSR
    if (!playerState.avFileUuid) {
      return (
        props.event.data.audiovisual_files[props.initialFile].file_url ||
        undefined
      );
    }

    const avFile = props.event.data.audiovisual_files[playerState.avFileUuid];

    if (avFile) {
      return avFile.file_url || undefined;
    }

    return undefined;
  }, [props.event, playerState]);

  const segments = useMemo(() => {
    if (playerState.snapToAnnotations) {
      return getSegments(playerState);
    } else {
      return [];
    }
  }, [playerState]);

  const tracksConfig = useMemo(() => {
    if (props.vttURLs && props.vttURLs.length > 0) {
      const config: {
        file: {
          tracks: {
            kind: 'captions';
            src: string;
            label: string;
            default?: boolean;
          }[];
        };
      } = {
        file: {
          tracks: [],
        },
      };
      config.file.tracks = props.vttURLs.map((u, idx) => {
        return {
          kind: 'captions',
          src: u.url,
          label: u.label,
          default: idx === 0 ? true : false,
        };
      });

      return config;
    } else {
      return {};
    }
  }, [props.vttURLs]);

  const player = useRef<ReactPlayerType>(null);

  // whether the user is currently seeking
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if (player.current && playerState.seekTo) {
      player.current.seekTo(playerState.seekTo);
    }
  }, [playerState.seekTo]);

  // populate the clip's start/end times in the nanostore
  useEffect(() => {
    if (props.start || props.end) {
      const clip = {
        start: props.start || 0,
        end: props.end || 0,
      };

      setClip(clip, props.id);
    }
  }, [props.start, props.end]);

  const formattedPosition = useMemo(
    () => formatTimestamp(playerState.position),
    [playerState.position]
  );

  const formattedDuration = useMemo(
    () => formatTimestamp(duration),
    [duration]
  );

  const onSeek = useCallback(
    (val: number[]) => {
      setSeeking(false);
      if (player.current) {
        player.current.seekTo(val[0] * duration);
      }
    },
    [player, setSeeking, duration]
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
      if (data.playedSeconds >= duration) {
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
        controls={props.event.data.item_type === 'Video'}
        playing={playerState.isPlaying}
        muted={muted}
        config={tracksConfig}
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
        onReady={() => {
          if (player.current && props.start) {
            // we need to check whether the current timestamp is 0,
            // because onReady is called on every seek for some reason
            // so if we don't do this check, it will go into an endless loop!
            if (player.current.getCurrentTime() === 0) {
              player.current?.seekTo(props.start);
            }
          }
        }}
        progressInterval={250}
        ref={player}
        url={fileUrl}
        height={props.event.data.item_type === 'Video' ? '100%' : 0}
        width={props.event.data.item_type === 'Video' ? '100%' : 0}
      />
      {props.event.data.item_type === 'Audio' ? (
        fileUrl ? (
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
                  defaultValue={[props.start ? props.start / duration : 0]}
                  min={props.start ? props.start / duration : 0}
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
        ) : (
          <p className='inline-flex italic h-[48px] items-end'>
            <span>No media is available.</span>
          </p>
        )
      ) : null}
    </div>
  );
};

export default Player;
