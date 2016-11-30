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

export const LOGIN_ERROR_MESSAGE = 'LOGIN_ERROR_MESSAGE'
export function loginErrorMessage(error) {
  return {
    type: LOGIN_ERROR_MESSAGE,
    loginError: error
  }
}

export const SIGNUP_ERROR_MESSAGE = 'SIGNUP_ERROR_MESSAGE'
export function signupErrorMessage(error) {
  return {
    type: SIGNUP_ERROR_MESSAGE,
    signupError: error
  }
}
