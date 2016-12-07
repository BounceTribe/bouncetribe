import {
  ATTEMPTED_LOGIN,
  ATTEMPTED_SIGNUP,
  LOGGED_IN,
  LOGGED_OUT,
  SIGNEDUP,
  CHECKED_LOCAL_STORAGE_FOR_TOKEN
} from 'actions/auth'

function auth (state = {}, action) {
  switch (action.type) {
    case ATTEMPTED_LOGIN: {
      return {
        ...state,
        attemptingLogin: action.attemptingLogin
      }
    }
    case ATTEMPTED_SIGNUP: {
      return {
        ...state,
        attemptingSignup: action.attemptingSignup
      }
    }
    case LOGGED_IN: {
      return {
        ...state,
        'id_token': action['id_token'],
        attemptingLogin: action.attemptingLogin,
      }
    }
    case LOGGED_OUT: {
      return {
        ...state,
        'id_token': action['id_token'],
      }
    }
    case SIGNEDUP: {
      return {
        ...state,
        attemptingSignup: action.attemptingSignup
      }
    }
    case CHECKED_LOCAL_STORAGE_FOR_TOKEN: {
      return {
        ...state,
        'id_token': action['id_token'],
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
