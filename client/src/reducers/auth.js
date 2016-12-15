import {
  LOGGED_IN,
  LOGGED_OUT,
  CHECKED_LOCAL_STORAGE_FOR_TOKEN
} from 'actions/auth'

function auth (state = {}, action) {
  switch (action.type) {
    // case ATTEMPTED_LOGIN: {
    //   return {
    //     ...state,
    //     attemptingLogin: action.attemptingLogin
    //   }
    // }
    // case ATTEMPTED_SIGNUP: {
    //   return {
    //     ...state,
    //     attemptingSignup: action.attemptingSignup
    //   }
    // }
    case LOGGED_IN: {
      return {
        ...state,
        'id_token': action['id_token'],
        user: action.user
      }
    }
    case LOGGED_OUT: {
      return {
        ...state,
        'id_token': action['id_token'],
        user: action.user
      }
    }
    // case SIGNEDUP: {
    //   return {
    //     ...state,
    //     attemptingSignup: action.attemptingSignup
    //   }
    // }
    case CHECKED_LOCAL_STORAGE_FOR_TOKEN: {
      return {
        ...state,
        'id_token': action['id_token'],
        user: {
          ...state.user,
          handle: action.handle
        }
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
