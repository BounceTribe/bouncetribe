
const nonAlphanumeric = /[^a-zA-Z\w_:]/gi

const restricted = [/admin/i, /profile/i, /tribe/i, /options/i, /settings/i, /login/i, /signup/i, /messages/i]

export const handleValidator = (handle) => {
  if (handle.length < 6) {
    return {
      valid: false,
      message: 'Must be greater than six characters.'
    }
  } else if (handle.match(nonAlphanumeric)) {
    return {
      valid: false,
      message: 'May only contain letters and numbers.'
    }
  } else if (handle.length > 20) {
    return {
      valid: false,
      message: 'Must be less than 20 character.'
    }
  }

// eslint-disable-next-line
  restricted.find((word)=>{
    if (word.test(handle)) {
      let wordString = word.toString().slice(1, word.length - 2)
      return {
        valid: false,
        message: `Your handle mayb not include the word '${wordString}' `
      }
    }
  })

  return {
    valid: true
  }

}

export const handleSanitizer = (handle) => {
  let sanitized = handle.replace(nonAlphanumeric, '')
  restricted.forEach((word)=>{
    sanitized = sanitized.replace(word, '')
  })
  if (sanitized > 20) {
    let difference = sanitized.length - 20
    sanitized.splice(sanitized.length - difference, difference, '')
  }
  if (sanitized < 6) {
    let difference = 6 - sanitized.length
    let hash = Math.random().splice(2,difference)
    sanitized = sanitized.join(hash)
  }
  return sanitized
}

export const titleSanitizer = (title) => {
  let sanitized = title
  restricted.forEach( (word) => {
    let match = sanitized.search(word)
    if (match === 0) {
      sanitized = sanitized.concat('-')
    }
  })
  if (sanitized.length < 6) {
    let hash = `~|h|~${Math.random().toString(36).substring(7,17)}`
    sanitized = sanitized.concat(hash)
  }
  return sanitized
}
