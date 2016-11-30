export const ATTEMPT_SIGNUP = 'ATTEMPT_SIGNUP'
export function attemptSignup() {
  return {
    type: ATTEMPT_SIGNUP,
  }
}

export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export function signupSuccess() {
  return {
    type: SIGNUP_SUCCESS,
  }
}

export const RECEIVED_SIGNUP_ERROR = 'RECEIVED_SIGNUP_ERROR'
export function receivedSignupError() {
  return {
    type: RECEIVED_SIGNUP_ERROR,
  }
}

export const RECEIVED_LOGIN_ERROR = 'RECEIVED_LOGIN_ERROR'
export function receivedLoginError() {
  return {
    type: RECEIVED_LOGIN_ERROR,
  }
}

export const ATTEMPT_LOGIN = 'ATTEMPT_LOGIN'
export function attemptLogin() {
  return {
    type: ATTEMPT_LOGIN,
  }
}


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export function loginSuccess(loginResult) {
  localStorage.setItem('user', JSON.stringify(loginResult))
  return {
    type: LOGIN_SUCCESS,
    'access_token': loginResult['access_token'],
    'id_token': loginResult['id_token']
  }
}

export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export function profileSuccess(profileResult) {
  return {
    type: PROFILE_SUCCESS,
    profile: profileResult,
  }
}


export const LOAD_USER_FROM_LOCAL_STORAGE = 'LOAD_USER_FROM_LOCAL_STORAGE'
export function loadUserFromLocalStorage() {
  const userData = localStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : {'id_token': false}
  return {
    type: LOAD_USER_FROM_LOCAL_STORAGE,
    user
  }
}

export const REQUEST_PROFILE = 'REQUEST_PROFILE'
export function requestProfile() {
  return {
    type: REQUEST_PROFILE
  }
}

export const LOGOUT = 'LOGOUT'
export function logout() {
  localStorage.removeItem('user')
  const wipeUser = {
    personID: false
  }
  return {
    type: LOGOUT,
    user: wipeUser
  }
}

export const SHOW_LOGIN_CARD = 'SHOW_LOGIN_CARD'
export function showLoginCard() {
  return {
    type: SHOW_LOGIN_CARD
  }
}

export const SHOW_SIGNUP_CARD = 'SHOW_SIGNUP_CARD'
export function showSignupCard() {
  return {
    type: SHOW_SIGNUP_CARD
  }
}
