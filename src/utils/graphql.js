import { graphCool } from 'config'
import auth from 'utils/auth'



export const findMatches = (project, currentSessions) => {
  return fetch(graphCool.simple, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          allProjects (
            first: 999
            filter: {
              privacy: PUBLIC
              genres_some: {
                id: "${project.genres.edges[0].node.id}"
              }
              creator: {
                id_not: "${project.creator.id}"
              }
              sessions_every: {
                id_not_in: [${currentSessions.toString()}]
              }
            }
          ) {
            id
            title
            createdAt
            creator {
              id
              handle
              portrait {
                url
              }
              placename
            }
            artwork {
              url
            }
          }
        }`
      }),
    }).then(result=>result.json()).then(json => {

      console.log("json.data.allProjects", json.data.allProjects )
      return json.data.allProjects
    })
}



export const findUserIds = (ids) => {
  return fetch(graphCool.simple, {
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
      return fetch(graphCool.simple, {
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
              friends (first: 999) {
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
  return fetch(graphCool.simple, {
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
  return fetch(graphCool.simple, {
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
    fetch(graphCool.simple, {
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
        fetch(graphCool.simple,{
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
  return fetch(graphCool.simple, {
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
  return fetch(graphCool.simple, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
        User (handle: "${handle}") {
          friends (first: 999) {
            projects (
              first: 2
              filter: {
                privacy_not: PRIVATE
              }
              orderBy: createdAt_ASC
            ) {
              id
              title
              genres (
                first: 999
              ) {
                name
              }
              artwork {
                url
              }
              creator {
                handle
                portrait {
                  url
                }
              }
              comments (first: 999) {
                type
              }
            }
          }
        }
      }`
    })
  }).then(response => response.json())
  .then(result => {
    console.log("result", result)
    return result.data.User.friends.projects
  })
}

export const getProjectId = (handle, title) => {
  return fetch(graphCool.simple, {
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
