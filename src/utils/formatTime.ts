export const formatTime = (time: number) => {
  if (time >= 60) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return time.toString().padStart(2, '0');
  }
};
