export const Err = (message) => {
  return new Error(message)
}

export const Log = (message, label, data) => {
  if (process.env.PRODUCTION) {

  } else {
    if (typeof data === Error) {
      if (message) {
        console.warn(message)
      }
      if (label && data) {
        console.groupCollapsed(`%c ${label}`, `background-color: lightgreen:`)
        console.log(data)
        console.groupEnd()
      }
    } else {
      if (message) {
        console.log(`%c ${message}`, `color: midnightblue; font-size: 13px; background-color: lightgreen;`)
      }
      if (label && data) {
        console.groupCollapsed(label)
        console.log(data)
        console.groupEnd()
      }
    }
  }
}
