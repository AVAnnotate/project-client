export const formatTimestamp = (seconds: number, includeMs = true) => {
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
  
    return str;
  };