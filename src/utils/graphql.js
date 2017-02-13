import { simple } from 'config'
import auth from 'utils/auth'

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


export const suggestedFriends = (userId) => {
  return new Promise((resolve, reject) => {
    auth.getUserInfo().then( profile =>{
      let friends = profile.context.mutualFriends.data
      let facebookIds = []
      for (let index in friends) {
        if (index) {
          facebookIds.push(`"${friends[index].id}"`)
        }
      }
      return fetch(simple, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          query: `{
            allUsers (
              first: 10
              filter: {
                facebookId_in: [${facebookIds.toString()}]
              }
            ) {
              id
              handle
              portrait {
                url
              }
            }
            User (id: "${userId}") {
              friends (first: 1000) {
                id
              }
            }
          }`
        }),
      }).then(result=>result.json()).then(json => {
        let fbFriends = json.data.allUsers.map(user=>user)
        let btFriends = json.data.User.friends.map(user => user.id)

        let suggestedFriends = fbFriends.filter((id)=>{
          return !btFriends.includes(id)
        })
        resolve(suggestedFriends)
      })
    })
  })
}
