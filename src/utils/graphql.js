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


export const getAllGenres = () => {
  return fetch(simple, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        allGenres (first: 300) {
          id
          name
        }
      }`
    }),
  })
  .then(result=>result.json()).then(json => {
    return json.data.allGenres
  })
}

export const getAllSkills = () => {
  return fetch(simple, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        allSkills (first: 300) {
          id
          name
        }
      }`
    }),
  })
  .then(result=>result.json()).then(json => {
    return json.data.allSkills
  })
}

export const ensureBtArtistExists = (artist) => {
  let {label: name} = artist
  let {spotifyId, imageUrl} = artist.value
  return new Promise( (resolve, reject)=>{
    fetch(simple, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          Artist (
            spotifyId: "${spotifyId}"
          ) {
            id
            imageUrl
            name
            spotifyId
          }
        }`
      }),
    })
    .then(response=>response.json())
    .then( result => {
      if (result.data.Artist) {
        resolve(result.data.Artist.id)
      } else {
        fetch(simple,{
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              mutation {
                createArtist(
                  imageUrl: "${imageUrl}"
                  name: "${name}"
                  spotifyId: "${spotifyId}"
                ) {
                  id
                  imageUrl
                  name
                  spotifyId
                }
              }
            `
          }),
        })
        .then(response => response.json())
        .then(result => {
          console.log(result)
          resolve(result.data.createArtist.id)
        })
      }
    })
  })
}
