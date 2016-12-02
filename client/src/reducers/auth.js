import {ATTEMPT_SIGNUP, SIGNUP_SUCCESS, LOGIN_SUCCESS, ATTEMPT_LOGIN, LOAD_USER_FROM_LOCAL_STORAGE, LOGOUT, RECEIVED_SIGNUP_ERROR, RECEIVED_LOGIN_ERROR, PROFILE_SUCCESS, LOGIN_ERROR_MESSAGE, SIGNUP_ERROR_MESSAGE} from '../actions/auth'

function auth (state = {}, action) {
  switch (action.type) {
    case ATTEMPT_SIGNUP: {
      return {
        ...state,
        awaitingSignupResponse: true
      }
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        awaitingSignupResponse: false
      }
    }
    case RECEIVED_SIGNUP_ERROR: {
      return {
        ...state,
        awaitingSignupResponse: false
      }
    }
    case ATTEMPT_LOGIN: {
      return {
        ...state,
        awaitingLoginResponse: true
      }
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        awaitingLoginResponse: false,
        'id_token': action['id_token']
      }
    }
    case PROFILE_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.profile
        }
      }
    }
    case RECEIVED_LOGIN_ERROR: {
      return {
        ...state,
        awaitingLoginResponse: false,
        user: null
      }
    }
    case LOAD_USER_FROM_LOCAL_STORAGE: {
      return {
        ...state,
        'id_token': action.idToken
      }
    }
    case LOGOUT: {
      return {
        ...state,
        user: action.user,
        'id_token': false
      }
    }
    case LOGIN_ERROR_MESSAGE: {
      return {
        ...state,
        loginError: action.loginError,
      }
    }
    case SIGNUP_ERROR_MESSAGE: {
      return {
        ...state,
        signupError: action.loginError,
      }
    }
    default: {
      return {
        ...state,
      }
    }
  }
}

export default auth
