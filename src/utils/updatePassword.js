const updatePassword = ({auth0Id, newPass}) => {

  let url = `https://bouncetribe.auth0.com/api/v2/users/${auth0Id}`

  let options = {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body:
     { password: newPass,
       connection: 'Username-Password-Authentication' },
    json: true
  }

  return new Promise( (resolve, reject) => {
    fetch(url, options)
    .then(result => result.json())
    .then(response => {
      resolve(response)
    })
  })
}
