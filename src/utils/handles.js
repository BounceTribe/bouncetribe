import {simple} from 'config'
import {randomString} from 'utils/random'
const nonAlphanumeric = /[^a-zA-Z\w_:]/gi

const restricted = [/admin/i, /profile/i, /tribe/i, /options/i, /settings/i, /login/i, /signup/i, /messages/i]


const isUniqueHandle = (handle) => {
  return fetch(simple,{
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        User (handle: "${handle}") {
          email
        }
      }`
    }),
  }).then(result=>result.json()).then(json=>{
    if (json.data.User) {
      return false
    } else {
      return true
    }
  })
}

const sanitizeHandle = (handle) => {
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
     sanitized = sanitized.join(randomString(difference))
   }
   return sanitized
}


export const handleValidator = (handle) => {
  let valid = handle.replace(nonAlphanumeric, '')
   restricted.forEach((word)=>{
     valid = valid.replace(word, '')
   })
   if (valid.length > 20) {
     return {
       handle: valid,
       error: 'Too long!'
     }
   }
   if (valid.length < 6) {
     return {
       handle: valid,
       error: 'Too short!'
     }
   }
   return {
     handle: valid,
     error: ''
   }
}
// const isValidHandle = () => {
//
// }

export const generateHandle = (email) => {
  return new Promise((resolve, reject)=>{
    let newHandle = email.split('@')[0]
    newHandle = sanitizeHandle(newHandle)
    isUniqueHandle(newHandle).then(
      result => {
        if (result) {
          resolve(newHandle)
        } else {
          resolve(randomString(15))
        }
      }
    )
  })
}
