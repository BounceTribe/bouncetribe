import store from '../store'
import { takeEvery } from 'redux-saga'
import {signupSuccess, loginSuccess, attemptLogin, loadUserFromLocalStorage, receivedSignupError, receivedLoginError, profileSuccess} from './auth'
import {loginErrorMessage, signupErrorMessage} from './ui'
import { put, call } from 'redux-saga/effects'
import {reset} from 'redux-form'

import {signupRoute, signupOptions, loginRoute, loginOptions, logoutRoute, logoutOptions, profileRoute, profileOptions} from '../config/auth0'


export function profileFetch() {
  const userData = localStorage.getItem('user')

  const user = JSON.parse(userData)


  const route = profileRoute
  const options = profileOptions(user['id_token'])

  return fetch(route, options).then(
    (response) => {
      return response.json()
    }
  ).then((json) => {
      if (json.error) {
        throw json.error
      } else {
        return json
      }
  })
}

export function checkLocal() {
  const userData = localStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null
  if (user) {
    return user
  } else {
    return null
  }
}


export function signupFetch() {
  const appState = store.getState()
  const email = appState.form.signup.values.email
  const password = appState.form.signup.values.password

  const route = signupRoute
  const options = signupOptions(email, password)

  return fetch(route, options).then(
    (response) => {
      return response.json()
    }
  ).then((json) => {
      if (json.error) {
        throw json.error
      } else {
        return json
      }
  })
}

export function loginFetch() {
  const appState = store.getState()

  const form = appState.form.signup ? appState.form.signup : appState.form.login

  const email = form.values.email
  const password = form.values.password

  const route = loginRoute
  const options = loginOptions(email, password)

  return fetch(route, options).then(
    (response) => {
      return response.json()
    }
  ).then((json) => {
    if (json.error) {
      console.log(json.error)
      throw json.error
    } else {
      return json
    }
  })
}


export function* signupCalls() {
  try {
    const signupResult = yield call(signupFetch)
    if (signupResult) {
      yield put(signupSuccess())
      yield put(attemptLogin())
    }
  } catch (error) {
      yield put(receivedSignupError())
      yield put(signupErrorMessage(error))

  }
}

export function* profileCalls() {
  try {
    const profileResult = yield call(profileFetch)
    if (profileResult) {
      yield put(profileSuccess(profileResult))
    }
  } catch (error) {
    console.log(error)
  }
}

export function* loginCalls() {
  try {
    const loginSuccessResult = yield call(loginFetch)

    if (loginSuccessResult) {
      yield put(loginSuccess(loginSuccessResult))
      yield put(reset('signup'))
    }

  } catch (error) {

    yield put (receivedLoginError())
    yield put(loginErrorMessage(error))

  }
}


export function logoutCall() {
  try {
    const route = logoutRoute
    const options = logoutOptions()
    fetch(route, options).then(
      (response) => {
      }
    )
  } catch (error) {
    console.log('logout error', error)
  }
}

export function* signup() {
  yield* takeEvery('ATTEMPT_SIGNUP', signupCalls)
}

export function* login() {
  yield* takeEvery('ATTEMPT_LOGIN', loginCalls)
}

export function* logout() {
  yield* takeEvery('LOGOUT', logoutCall)
}

export function* getProfileInformation() {
  yield* takeEvery('LOGIN_SUCCESS', profileCalls)
}

export function* startup() {
  yield put(loadUserFromLocalStorage())
  const userData = localStorage.getItem('user')
  const user = JSON.parse(userData)
  if (user) {
    yield put(loginSuccess(user))
  }
}

export function* rootSaga() {
  yield [
    getProfileInformation(),
    signup(),
    login(),
    logout(),
    startup(),
  ]
}
