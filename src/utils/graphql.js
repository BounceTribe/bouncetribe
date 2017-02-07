import { simple } from 'config'

export const findUserIds = (ids) => {
  return fetch(simple, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          allUsers (filter: {
            auth0UserId_in: [${ids.toString()}]
          }) {
            id
            email
          }
        }`
      }),
    }).then(result=>result.json()).then(json => {
      return json.data.allUsers.map(user => user.id)
    })
}
