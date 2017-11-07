import {auth0} from 'config'

export const updatePassword = (auth0UserId, newPass) => {
  console.log('updatePassword', auth0UserId, newPass);
  let url = `https://${auth0.domain}/api/v2/users/${auth0UserId}`

  let options = {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body:
     { password: newPass,
       connection: 'Username-Password-Authentication' },
    json: true,
    // idToken: auth.getToken()
  }

  return new Promise( (resolve, reject) => {
    fetch(url, options)
    .then(result => result.json())
    .then(response => {
      resolve(response)
    })
  })
}
