export const ATTEMPTED_LOGIN = 'ATTEMPTED_LOGIN'

export function attemptLogin() {
  return {
    type: ATTEMPTED_LOGIN,
    attemptingLogin: Date.now()
  }
}

export const ATTEMPTED_SIGNUP = 'ATTEMPTED_SIGNUP'

export function attemptSignup() {
  return {
    type: ATTEMPTED_SIGNUP,
    attemptingSignup: Date.now()
  }
}


export const LOGGED_IN = 'LOGGED_IN'

export function loginSuccess(idToken) {
  console.log('action', idToken)
  localStorage.setItem('id_token', idToken)
  return {
    type: LOGGED_IN,
    'id_token': idToken,
    attemptingLogin: false
  }
}

export const LOGGED_OUT = 'LOGGED_OUT'

export function logout() {
  localStorage.removeItem('id_token')
  return {
    type: LOGGED_OUT,
    'id_token': false
  }
}

export const SIGNEDUP = 'SIGNEDUP'

export function signupSuccess() {
  return {
    type: SIGNEDUP,
    attemptingSignup: false
  }
}


export const CHECKED_LOCAL_STORAGE_FOR_TOKEN = 'CHECKED_LOCAL_STORAGE_FOR_TOKEN'

export function checkLocalStorageForToken() {
  let localToken = localStorage.getItem('id_token')
  const idToken = localToken ? localToken : false
  return {
    type: CHECKED_LOCAL_STORAGE_FOR_TOKEN,
    'id_token': idToken,
  }
}
