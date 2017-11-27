import {auth0} from 'config'

export const connectAuth0Accounts = (inputObject) => {
  let {
    primaryAuth0UserId,
    primaryToken,
    secondaryToken
  } = inputObject
  let route = `https://${auth0.domain}/api/v2/users/${primaryAuth0UserId}/identities`

  let options = {
    method: 'POST',
    headers: {
      Authorization: "Bearer "+ primaryToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "link_with": secondaryToken,
    })
  }

  return fetch(route,options).then(resp => resp.json()).then(json=>json)
}
