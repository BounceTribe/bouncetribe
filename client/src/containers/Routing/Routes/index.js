import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Relay from 'react-relay'
import UI from './UI'
import Home from './Home'
import Profile from './Profile'
import Projects from './Projects'
import SingleProject from './SingleProject'
import Tribe from './Tribe'
import auth from 'config/auth'
import SigninUserMutation from 'mutations/SigninUserMutation'
import {Err, narrate, show} from 'utils'
import Loading from 'reusables/Loading'

const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

const provideHandle = (params, router) => {
  narrate('providingHandle for prepareParams')
  show('params', params)
  show('router', router)
  return {
    ...params,
    handle: params.handle,
  }
}

const provideHandleTitle = (params, router) => {
  return {
    ...params,
    handle: params.handle,
    title: params.title
  }
}

const requireAuth = async (nextState, replace) => {
  narrate('onEnter using requireAuth')
  show('nextState', nextState)
  show('replace', replace)
  try {
    let localToken = auth.getToken()
    if (localToken) {
      await new Promise ( (resolve, reject) => {
        Relay.Store.commitUpdate(
          new SigninUserMutation({
            authToken: localToken
          }), {
            onSuccess: (response) => {
              console.log('login success')
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
    auth.logout()
    replace({ pathname: '/' })
  }
}

const createRoutes = () => {
  return (
    <Route
      path="/"
      component={UI}
      queries={ViewerQueries}
    >
      <IndexRoute
        component={Home}
        queries={ViewerQueries}
        auth={auth}
        render={({ props }) => props ? <Home {...props} /> : <Loading />}
      />

      <Route
        path="/login/*"
        queries={ViewerQueries}
        component={Home}
        auth={auth}
        render={({ props }) => props ? <Home {...props} /> : <Loading />}
      />

      {/* <Route
        path="/admin/*"
        queries={ViewerQueries}
        component={Admin}
      /> */}

      <Route
        path="/:handle/tribe"
        component={Tribe}
        queries={ViewerQueries}
        onEnter={requireAuth}
        render={({ props }) => props ? <Tribe {...props} /> : <Loading />}
      >
        <Route
          path="/:handle/tribe/:list"
          component={Tribe}
          queries={ViewerQueries}
          onEnter={requireAuth}
          render={({ props }) => props ? <Tribe {...props} /> : <Loading />}
        />
      </Route>


      <Route
        path="/:handle/projects"
        component={Projects}
        onEnter={requireAuth}
        queries={ViewerQueries}
        prepareParams={provideHandle}
        render={({ props }) => props ? <Projects {...props} /> : <Loading />}
      />

      <Route
        path="/:handle/:title"
        component={SingleProject}
        onEnter={requireAuth}
        queries={ViewerQueries}
        prepareParams={provideHandleTitle}
        render={({ props }) => props ? <SingleProject {...props} /> : <Loading />}
      />



      <Route
        path="/:handle"
        component={Profile}
        onEnter={requireAuth}
        queries={ViewerQueries}
        prepareParams={provideHandle}
        render={({ props }) => props ? <Profile {...props} /> : <Loading />}
      />

    </Route>
  )
}

const Routes = createRoutes()

export default Routes
