const sendEmailInvite = (query) => {
  let url = `https://bt-carl-api.herokuapp.com/email`
  let body = JSON.stringify({query})
  console.log('email hit')
  let options = {
    method: 'Post',
    headers: {
      "Content-Type": 'application/json'
    },
    body
  }
  return new Promise( (resolve, reject) => {
    fetch(url, options).then(result => resolve(result))
  })
}


export default sendEmailInvite
