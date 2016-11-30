export const auth0id = process.env.AUTH0_CLIENTID
export const auth0domain = 'carlpeaslee.auth0.com'

const baseRoute = 'https://'+ auth0domain

export const signupRoute = baseRoute + '/dbconnections/signup'
export const loginRoute = baseRoute + '/oauth/ro'
export const logoutRoute = baseRoute + '/v2/logout?'
export const profileRoute = baseRoute + '/tokeninfo'


export const loginOptions = (email, password) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:   JSON.stringify({
      'client_id': auth0id,
      username: email,
      password: password,
      connection: 'Username-Password-Authentication',
      'id_token': '',
      'grant_type': 'password',
      scope: 'openid',
      'device': 'browser'
    })
  }
}

export const signupOptions = (email, password) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:   JSON.stringify({
      'client_id': auth0id,
      email: email,
      password: password,
      connection: 'Username-Password-Authentication'
    })
  }
}

export const logoutOptions = () => {
  return {
    method: 'GET',
    mode: 'no-cors'
  }
}

export const profileOptions = (idToken) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:   JSON.stringify({
      'id_token': idToken,
    })
  }
}
