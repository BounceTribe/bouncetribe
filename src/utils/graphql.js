import { graphCool } from 'config'
import auth from 'utils/auth'

export const findMatches = async ({user, project}) => {
  try {
    let genre = project.genres.edges[0].node.id
    let projectsToExclude = []
    let usersToExclude = []

    user.projects.edges.forEach((projectEdge) => {
      projectEdge.node.sessions.edges.forEach((sessionEdge) => {
        sessionEdge.node.projects.edges.forEach((edge) => {
          let {
            id: projectId,
            creator: { handle: creatorHandle }
          } = edge.node
          if (projectId !== project.id) {
            projectsToExclude.push(`"${projectId}"`)
            usersToExclude.push(`"${creatorHandle}"`)
          }
        })
      })
    })

    usersToExclude.push(`"${user.handle}"`)

    user.friends.edges.forEach((friendEdge) => {
      usersToExclude.push(`"${friendEdge.node.handle}"`)
    })

    let response = await fetch(graphCool.simple, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          query: /* GraphQL */`{
            allProjects (
              first: 20
              filter: {
                privacy: PUBLIC
                genres_some: { id: "${genre}" }
                creator: { handle_not_in: [${usersToExclude.toString()}] }
                id_not_in: [${projectsToExclude.toString()}]
              }
            ) {
              id
              title
              createdAt
              creator {
                id
                handle
                score
                portrait { url }
                placename
              }
              artwork { url }
            }
          }`
        }),
      })
      let json = await response.json()

      let {allProjects} = json.data

      let uniqueCreatorIds = []
      let uniqueProjects = []

      allProjects.forEach( project => {
        if (!uniqueCreatorIds.includes(project.creator.id)) {
          uniqueCreatorIds.push(project.creator.id)
          uniqueProjects.push(project)
        }
      })

      uniqueProjects.sort((a, b) => b.creator.score - a.creator.score )

      return uniqueProjects.slice(0,6)
  } catch (e) {
    console.log("findMatches error", e)
  }
}



export const findUserIds = (ids) => {
  return fetch(graphCool.simple, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: /* GraphQL */`{
        allUsers ( filter: { auth0UserId_in: [${ids.toString()}] } ) {
          id
          email
          placename
          score
        }
      }`
    }),
  }).then(result => result.json())
    .then(json => json.data.allUsers.map(user => user.id) )
}

export const suggestedFriends = (userId) => {
  return new Promise((resolve, reject) => {
    auth.getUserInfo().then( profile =>{
      let friends = ((profile.context || {}).mutual_friends || []).data
      let facebookIds = []
      for (let index in friends) {
        if (index) {
          facebookIds.push(`"${friends[index].id}"`)
        }
      }
      return fetch(graphCool.simple, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          query: /* GraphQL */`{
            allUsers (
              first: 10
              filter: { facebookId_in: [${facebookIds.toString()}] }
            ) {
              id
              handle
              portrait { url }
              score
            }
            User (id: "${userId}") {
              friends (first: 999) { id }
            }
          }`
        }),
      }).then(result=>result.json()).then(json => {
        let fbFriends = (json.data.allUsers || []).map(user=>user)
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
      query: /* GraphQL */`{
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
      query: /* GraphQL */`{
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
        query: /* GraphQL */`{
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
            query: /* GraphQL */`
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
      query: /* GraphQL */`{
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
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: /* GraphQL */`{
        User (handle: "${handle}") {
          friends (
            first: 999
            filter: {deactivated: false}
          ) {
            projects (
              first: 2
              filter: { privacy_not: PRIVATE }
              orderBy: createdAt_ASC
            ) {
              id
              title
              genres ( first: 999 ) { name }
              artwork { url }
              creator {
                handle
                portrait { url }
              }
              comments (first: 999) { type }
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
      query: /* GraphQL */`{
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
