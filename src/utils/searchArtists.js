const searchArtists = (query) => {
  let url = `https://bt-carl-api.herokuapp.com/artists`
  let body = JSON.stringify({query})
  let options = {
    method: 'Post',
    headers: {
      "Content-Type": 'application/json'
    },
    body
  }
  return new Promise( (resolve, reject) => {
    fetch(url, options)
    .then(result => result.json())
    .then(response => {
      resolve(response)
    })
  })
}


export default searchArtists
