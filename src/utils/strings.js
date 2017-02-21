export const formatEnum = (input) => {
  let formatted = `${input.substring(0,1)}${input.substring(1).toLowerCase()}`
  return formatted
}
