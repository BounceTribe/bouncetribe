export const formatEnum = (input) => {
  if (!input) {
    return ''
  } else {
    let formatted = `${input.substring(0,1)}${input.substring(1).toLowerCase()}`
    return formatted
  }
}
