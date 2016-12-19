import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Relay from 'react-relay'
import store from 'store'
import ReduxProvider from './ReduxProvider'
import Home from './Home'
import Profile from './Profile'
import Projects from './Projects'
import Tribe from './Tribe'
// import Admin from './Admin'
import auth from 'config/auth'
import SigninUserMutation from 'mutations/SigninUserMutation'
import {loginSuccess} from 'actions/auth'
import {Err, Log} from 'utils'


const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}


const requireAuth = async (nextState, replace) => {
  try {
    let reduxToken = store.getState().auth['id_token']
    let localToken = auth.getToken()
    if (reduxToken) {
      Log('logged in, looks good')
    } else if (localToken && !reduxToken) {
      await new Promise ( (resolve, reject) => {
        Relay.Store.commitUpdate(
          new SigninUserMutation({
            authToken: localToken,
            viewer: {id: "viewer-fixed"}
          }), {
            onSuccess: (response) => {
              Log('signed in to BT', response)
              let idToken = response.signinUser.token
              let user = response.signinUser.viewer.user
              store.dispatch(loginSuccess(idToken, user))
              resolve()
            },
            onFailure: (response) => {
              Log('Failed to signin to BT')
              reject(response.getError())
            }
          }
        )
      }).catch((reason)=>{
        throw reason
      })
      Log('welcome back')
      replace({
        pathname: `/${nextState.location}`
      })
    } else {
      throw Err('Couldnt login')
    }
  } catch (error) {
    Log(error)
    replace({ pathname: '/' })
  }
}

const createRoutes = () => {
  return (
    <Route
      path="/"
      component={ReduxProvider}
    >
      <IndexRoute
        component={Home}
        queries={ViewerQueries}
        auth={auth}
      />

      <Route
        path="/login/*"
        queries={ViewerQueries}
        component={Home}
        auth={auth}
      />

      {/* <Route
        path="/admin/*"
        queries={ViewerQueries}
        component={Admin}
      /> */}


      <Route
        path="/:handle/projects"
        component={Projects}
        onEnter={requireAuth}
      />
      <Route
        path="/:handle/tribe"
        component={Tribe}
        queries={ViewerQueries}
        onEnter={requireAuth}
      />

      <Route
        path="/:handle"
        component={Profile}
        queries={ViewerQueries}
        onEnter={requireAuth}
      />

    </Route>
  )
}

const Routes = createRoutes()

export default Routes
