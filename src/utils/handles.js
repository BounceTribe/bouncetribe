import {graphCool} from 'config'
import {randomString} from 'utils/random'
const nonAlphanumeric = /[^a-zA-Z\w_:]/gi

const restricted = [/admin/i, /profile/i, /tribe/i, /options/i, /settings/i, /login/i, /signup/i, /messages/i, /dash/, /feed/i, /session/i, /projects/i, /bounces/i, /unsubscribe/i, /notribe/i, /mentor/i, /editProfile/i, /acceptinvite/i, /acceptrequest/i]


export const isUniqueField = (value, type, model) => {
  type = type || 'handle'
  model = model || 'User'
  return fetch(graphCool.simple, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `{
        ${model} (${type}: "${value}") { id }
      }`
    }),
  }).then(result=>result.json()).then(json=>{
    console.log({json});
    return json.data[model] ? false : true
  })
}

const sanitizeHandle = (handle) => {
  let sanitized = handle.replace(nonAlphanumeric, '')
   restricted.forEach((word)=>{
     sanitized = sanitized.replace(word, '')
   })
   if (sanitized > 15) {
     let difference = sanitized.length - 15
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
   if (valid.length > 15) {
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

export const generateHandle = (email) => {
  return new Promise((resolve, reject)=>{
    let newHandle = email.split('@')[0]
    if (newHandle.length > 15) {
      newHandle = newHandle.slice(0,15)
    }
    newHandle = sanitizeHandle(newHandle)
    isUniqueField(newHandle).then(
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
