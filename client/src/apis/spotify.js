const baseRoute = 'https://api.spotify.com'

export const spotifyConfig = (query) => {

  return [
    baseRoute + `/v1/search?q=${query}&type=artist&market=us&limit=50`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
  ]
}
