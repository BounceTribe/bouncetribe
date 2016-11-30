import {ATTEMPT_SIGNUP, SIGNUP_SUCCESS, LOGIN_SUCCESS, ATTEMPT_LOGIN, LOAD_USER_FROM_LOCAL_STORAGE, LOGOUT, RECEIVED_SIGNUP_ERROR, RECEIVED_LOGIN_ERROR, PROFILE_SUCCESS} from '../actionCreators'

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
        user: {
          'access_token': action['access_token'],
          'id_token': action['id_token']
        }
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
        user: action.user
      }
    }
    case LOGOUT: {
      return {
        ...state,
        user: action.user
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
