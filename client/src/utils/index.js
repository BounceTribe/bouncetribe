export const Err = (message) => {
  let error = new Error()
  error.message = message
  error.stack = false
}
