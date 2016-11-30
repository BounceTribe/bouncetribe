import {SHOW_LOGIN_CARD, SHOW_SIGNUP_CARD, LOGIN_ERROR_MESSAGE, SIGNUP_ERROR_MESSAGE, LOGIN_SUCCESS, SIGNUP_SUCCESS, LOGOUT} from '../actionCreators'

function ui(state = {}, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loginCardShowing: false,
        signupCardShowing: false,
        loginError: null
      }
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        loginCardShowing: false,
        signupCardShowing: false,
        signupError: null
      }
    }
    case SHOW_LOGIN_CARD: {
      return {
        ...state,
        loginCardShowing: true,
        signupCardShowing: false
      }
    }
    case SHOW_SIGNUP_CARD: {
      return {
        ...state,
        loginCardShowing: false,
        signupCardShowing: true
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
    case LOGOUT: {
      return {
        ...state,
        loginCardShowing: true,
      }
    }
    default: {
      return state
    }
  }
}

export default ui
