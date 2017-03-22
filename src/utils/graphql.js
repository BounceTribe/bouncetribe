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
            placename
            score
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
              score
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
        let suggestedFriends = fbFriends.filter((fbFriend)=>{
          return !btFriends.includes(fbFriend.id)
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
        allGenres (
          first: 300
          orderBy: name_ASC
        ) {
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

export const ensureUsersProjectTitleUnique = (userId, projectTitle)=> {
  return fetch(simple, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        User (id: "${userId}") {
          projects (
            first: 1
            filter: {
              title: "${projectTitle}"
            }
          ) {
            id
            title
          }
        }
      }`
    }),
  })
  .then(result=>result.json()).then(json => {
    if (json.data.User.projects.length > 0) {
      return false
    } else {
      return true
    }

  })
}

export const fetchFeed = (handle) => {
  return fetch(simple, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        allProjects (
          first: 10
          orderBy: updatedAt_ASC
          filter: {
            creator: {
              handle_not: "${handle}"
              friends_every: {
                handle: "${handle}"
              }
            }
            privacy_not: PRIVATE
          }
        ) {
          id
          title
          artwork {
            url
          }
          genres (first: 1){
            name
          }
          comments (first: 999){
            id
          }
          creator {
            handle
            portrait {
              url
            }
          }
        }
      }`
    })
  }).then(response => response.json())
  .then(result => result.data.allProjects)
}

export const getProjectId = (handle, title) => {
  return fetch(simple, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        allProjects (
          filter: {
            creator: {
              handle: "${handle}"
            }
            title: "${title}"
          }
        ) {
          id
        }
      }`
    }),
  }).then(result=>result.json()).then(json => {
    return json.data.allProjects[0].id
  })
}
