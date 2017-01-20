const formatTime = (duration) => {
  if (!duration) {
    return '0:00'
  }

  let minutes = Math.floor(duration/60)
  let seconds = Math.floor(duration - (minutes * 60))

  if (seconds < 10) {
    seconds = `0${seconds}`
  }

  return `${minutes}:${seconds}`
}
