export function formatTime(ms) {
  if (ms <= 0) return 'Sale Ended!';
  const sec = Math.floor(ms/1000), min = Math.floor(sec/60), s = sec % 60;
  return `${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
