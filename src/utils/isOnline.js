import Moment from 'moment'

export const isOnline = (user) => {
  let online = false
  if (user.lastPing) {
    let now = Moment()
    online = now.diff(user.lastPing, 'seconds') < 610
  }
  return online
}

export const doNotPing = (user) => {
  let online = false
  if (user.lastPing) {
    let now = Moment()
    online = now.diff(user.lastPing, 'seconds') < 300
  }
  return online
}
