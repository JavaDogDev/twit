export default function timeSince(timeStamp) {
  const now = new Date();
  const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return `${parseInt(secondsPast, 10)}s`;
  }
  if (secondsPast < 3600) {
    return `${parseInt(secondsPast / 60, 10)}m`;
  }
  if (secondsPast <= 86400) {
    return `${parseInt(secondsPast / 3600, 10)}h`;
  }
  if (secondsPast > 86400) {
    const day = timeStamp.getDate();
    const month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ', '');
    const year = timeStamp.getFullYear() === now.getFullYear()
      ? ''
      : ` ${timeStamp.getFullYear()}`;
    return `${day} ${month}${year}`;
  }
}
