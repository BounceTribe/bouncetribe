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
export function loginSuccess(idToken) {
  localStorage.setItem('id_token', idToken)
  return {
    type: LOGIN_SUCCESS,
    'id_token': idToken
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
  const userToken = localStorage.getItem('id_token')
  return {
    type: LOAD_USER_FROM_LOCAL_STORAGE,
    'id_token': userToken
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
  localStorage.removeItem('id_token')
  return {
    type: LOGOUT,
    idToken: false,
    user: false
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
