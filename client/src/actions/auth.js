
import {browserHistory} from 'react-router'

export const LOGGED_IN = 'LOGGED_IN'

export function loginSuccess(idToken, user) {
  return {
    type: LOGGED_IN,
    'id_token': idToken,
    user
  }
}

export const LOGGED_OUT = 'LOGGED_OUT'

export function logout() {
  localStorage.removeItem('id_token')
  localStorage.removeItem('access_token')
  browserHistory.replace({
    pathname: '/'
  })
  return {
    type: LOGGED_OUT,
    'id_token': false,
    user: false
  }
}
