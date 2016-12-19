import url from 'config/url'

export const auth0id = 'wMoUQb2Kb9XViLB6Wek2fLYPlMxJV5hg'
export const auth0domain = 'carlpeaslee.auth0.com'

export const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJkajdDOVFCZkV3cG45bVBTSE1FUU04YnduNU9lNHZ0bSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInVwZGF0ZSJdfX0sImlhdCI6MTQ4MTgxNDY2NywianRpIjoiZDI4ZWZhZmMyMjBkY2EwYTI2NGI4NzRhMDRiYzMwMGUifQ.V4t6mu445DmLS4FSVt7E86meiIwFngAlnNkTlX8x03E'

const baseRoute = 'https://'+ auth0domain

export const signupRoute = baseRoute + '/dbconnections/signup'
export const loginRoute = baseRoute + '/oauth/ro'
export const logoutRoute = baseRoute + '/v2/logout?'
export const profileRoute = baseRoute + '/tokeninfo'
export const fbAccessRoute =  baseRoute + `/authorize?response_type=token&client_id=${auth0id}&connection=facebook&redirect_uri=${url}/social/&state=VALUE_THAT_SURVIVES_REDIRECTS&nonce=RANDOM_VALUE&scope=openid`

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


export const linkAccountsOptions = (inputObject) => {
  let {
    primaryAuth0UserId,
    primaryToken,
    secondaryToken
  } = inputObject
  return [
    `${baseRoute}/api/v2/users/${primaryAuth0UserId}/identities`,
    {
      method: 'POST',
      headers: {
        Authorization: "Bearer "+primaryToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "link_with": secondaryToken,
      })
    }
  ]
}

export const newLoginOptions = (email, password) => {
  return [
    `${baseRoute}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:   JSON.stringify({
        'grant_type': 'password',
        'client_id': 'fjV44gUO1o1RLFfaKJL7LEfE4ofb7qCA',
        'audience': 'BounceTribeAPI',
        username: email,
        password: password,
        scope: 'openid',
      })
    }
  ]
}

export const newSignupOptions = (email, password) => {
  return [
    `${baseRoute}/authorize?response_type=token
    &client_id=wMoUQb2Kb9XViLB6Wek2fLYPlMxJV5hg
    &connection=null
    &redirect_uri=http://localhost:3000/admin/
    &state=OPAQUE_VALUE
    &scope=openid%20name%20picture`
  ]
}
