export const Err = (message) => {
  return new Error(message)
}

export const Log = (message, label, data) => {
  if (process.env.NODE_ENV === 'production') {

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
        console.log(`%c ${message}`, `color: midnightblue; font-size: 10px; background-color: lightgreen;`)
      }
      if (label && data) {
        console.groupCollapsed(label)
        console.log(data)
        console.groupEnd()
      }
    }
  }
}


export const narrate = (message, colorOrFlag) => {
  if (colorOrFlag === 'flag') {
    console.log(`%c \n ...${message}... \n`, `color: grey; font-size: 12px; font-style: italic; font-weight: bold; background-color: lightgreen;`)
  } else {
    console.log(`%c ...${message}...`, `color: ${(colorOrFlag) ? colorOrFlag : 'grey'}; font-size: 10px; font-style: italic;`)
  }
}

export const show = (label, data, show) => {
  if (show) {
    console.group(`%c ${label}`, `color: black`)
    console.log(data)
    console.groupEnd()
  } else {
    console.groupCollapsed(`%c ${label}`, `color: grey`)
    console.log(data)
    console.groupEnd()
  }
}

export const warn = (message) => {
  console.warn(`%c ${message}`, `color: black; font-size: 11px; background-color: salmon;`)
}

export const showWarn = (label, data, hide) => {
  if (hide) {
    console.groupCollapsed(`%c ${label}`, `color: grey; font-size: 11px; background-color: salmon;`)
    console.log(data)
    console.groupEnd()
  } else {
    console.group(`%c ${label}`, `color: black; font-size: 11px; background-color: salmon;`)
    console.log(data)
    console.groupEnd()
  }
}
