export const formatTimestamp = (seconds: number, includeMs = false) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  let ms;

  let str = `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;

  if (includeMs) {
    ms = date.getUTCMilliseconds().toString().padStart(3, '0');
    str = `${str}:${ms}`;
  }

  if (str.startsWith('00:')) {
    str = str.slice(3);
  } else if (str.startsWith('0')) {
    str = str.slice(1);
  }

  return str;
};

export const defaultState = {
  annotations: [],
  annotationStarts: [],
  autoScroll: false,
  avFileUuid: '',
  currentAnnotation: 0,
  id: '',
  isPlaying: false,
  filteredAnnotations: [],
  position: 0,
  searchQuery: '',
  seekTo: 0,
  sets: [],
  snapToAnnotations: false,
  showTags: true,
  tags: [],
};
