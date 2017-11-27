import Moment from 'moment'

export const isOnline = (user) => {
  let online = false
  if (user.lastPing) {
    let now = Moment()
    online = now.diff(user.lastPing, 'seconds') < 315
  }
  return online
}
