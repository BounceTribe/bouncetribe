
const nonAlphanumeric = /[^a-zA-Z\w:]/i

export const handleValidator = (handle) => {
  if (handle.length < 6) {
    return {
      valid: false,
      message: 'Your handle must be greater than six characters.'
    }
  } else if (handle.match(nonAlphanumeric)) {
    return {
      valid: false,
      message: 'Your handle may only contain letters and numbers.'
    }
  } else if (handle.length > 20) {
    return {
      valid: false,
      message: 'Your handle must be less than 20 character.'
    }
  } else {
    return {
      valid: true
    }
  }
}
