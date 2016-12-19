import {graphqlUrl} from 'config/urls'

export const searchArtistsOptions = (spotifyId) => {
  return [
    graphqlUrl,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          allArtists (filter: {
            spotifyId: "${spotifyId}"
          }) {
            id
            imageUrl
            name
            spotifyId
          }
        }`
      }),
    }
  ]
}

export const createArtistOptions = (spotifyId, name, imageUrl) => {
  return [
    graphqlUrl,
    {
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
    }
  ]
}


export const checkIfUserExists = (auth0id) => {
  return [
    graphqlUrl,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          allUsers (filter: {
            auth0UserId_contains: "${auth0id}"
          }) {
            id
            name
            email
          }
        }`
      }),
    }
  ]
}

export const checkIfUserEmailExists = (email) => {
  return [
    graphqlUrl,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          allUsers (filter: {
            email: "${email}"
          }) {
            id
            name
            email
            auth0UserId
          }
        }`
      }),
    }
  ]
}
