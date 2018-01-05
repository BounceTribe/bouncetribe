const changePassword = (query) => {
  // let url = `http://localhost:5000/changepassword`
  let url = `https://bt-carl-api.herokuapp.com/changepassword`
  let body = JSON.stringify({query})
  console.log('sending new password')
  let options = {
    method: 'Post',
    headers: { "Content-Type": 'application/json' },
    body
  }
  return new Promise( (resolve, reject) =>
    fetch(url, options).then(result => resolve(result))
  )
}


export default changePassword
