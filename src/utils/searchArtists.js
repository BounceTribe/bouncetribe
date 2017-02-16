const searchArtists = (query) => {
  let url = `https://api.spotify.com/v1/search?q=${query}&type=artist&market=us&limit=50`
  let options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
  return new Promise( (resolve, reject) => {
    fetch(url, options)
    .then(result => result.json())
    .then(response => {
      let options = response.artists.items.map((artist) => {
        return {
          value: {
            spotifyId: artist.id,
            imageUrl: (artist.images.length > 0) ? artist.images[0].url : '',
            influenceId: false,
            id: false
          },
          label: artist.name
        }
      })
      resolve({options})
    })
  })
}


export default searchArtists
