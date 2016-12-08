const graphqlUrl = 'https://api.graph.cool/simple/v1/ciwdr6snu36fj01710o4ssheb'

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
