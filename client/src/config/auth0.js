export const auth0id = 'wMoUQb2Kb9XViLB6Wek2fLYPlMxJV5hg'
export const auth0domain = 'carlpeaslee.auth0.com'

const baseRoute = 'https://'+ auth0domain

export const signupRoute = baseRoute + '/dbconnections/signup'
export const loginRoute = baseRoute + '/oauth/ro'
export const logoutRoute = baseRoute + '/v2/logout?'
export const profileRoute = baseRoute + '/tokeninfo'
export const fbAccessRoute =  baseRoute + `/authorize?response_type=token&client_id=${auth0id}&connection=facebook&redirect_uri=http://localhost:3000/login/social/&state=VALUE_THAT_SURVIVES_REDIRECTS&nonce=RANDOM_VALUE&scope=openid`

export const fbLoginRoute = baseRoute + '/oauth/access_token'

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

export const fbAccess = () => {
  return {
    method: 'GET',
    mode: 'no-cors'
  }
}


export const fbLoginOptions = (accessToken) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:   JSON.stringify({
      'client_id': auth0id,
      'access_token': accessToken,
      connection: 'facebook',
      scope: 'openid',
    })
  }
}
