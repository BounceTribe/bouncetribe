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
import {Err} from 'utils'


const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

const provideHandle = (params, {location}) => {
  return {
    ...params,
    handle: params.handle
  }
}

const requireAuth = async (nextState, replace) => {
  try {
    let reduxToken = store.getState().auth['id_token']
    let localToken = auth.getToken()
    if (reduxToken) {
    } else if (localToken && !reduxToken) {
      await new Promise ( (resolve, reject) => {
        Relay.Store.commitUpdate(
          new SigninUserMutation({
            authToken: localToken,
            viewer: {id: "viewer-fixed"}
          }), {
            onSuccess: (response) => {
              let idToken = response.signinUser.token
              let user = response.signinUser.viewer.user
              store.dispatch(loginSuccess(idToken, user))
              resolve()
            },
            onFailure: (response) => {
              reject(response.getError())
            }
          }
        )
      }).catch((reason)=>{
        throw reason
      })
      replace({
        pathname: `/${nextState.location}`
      })
    } else {
      throw Err('Couldnt login')
    }
  } catch (error) {
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
        queries={ViewerQueries}
        prepareParams={provideHandle}
      >

        <Route
          path="/:handle/projects/:title"
          component={Projects}
          onEnter={requireAuth}
          queries={ViewerQueries}
          prepareParams={provideHandle}
        />

      </Route>
      <Route
        path="/:handle/tribe"
        component={Tribe}
        queries={ViewerQueries}
        onEnter={requireAuth}
      >
        <Route
          path="/:handle/tribe/:list"
          component={Tribe}
          queries={ViewerQueries}
          onEnter={requireAuth}
        />
      </Route>

      <Route
        path="/:handle"
        component={Profile}
        onEnter={requireAuth}
        queries={ViewerQueries}
        prepareParams={provideHandle}
      />

    </Route>
  )
}

const Routes = createRoutes()

export default Routes

//
// getQueries={({location, params}) => {
//   const userHandle = store.getState().auth.user.handle
//   const queryHandle = params.handle
//   if (userHandle === queryHandle ) {
//     return SelfHandle
//   } else {
//     return OtherHandle
//   }
// }}
