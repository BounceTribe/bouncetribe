import {base, auth0} from 'config/urls'

export const linkAccountsOptions = (inputObject) => {
  let {
    primaryAuth0UserId,
    primaryToken,
    secondaryToken
  } = inputObject
  return [
    `${base}${auth0}/api/v2/users/${primaryAuth0UserId}/identities`,
    {
      method: 'POST',
      headers: {
        Authorization: "Bearer "+primaryToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "link_with": secondaryToken,
      })
    }
  ]
}
