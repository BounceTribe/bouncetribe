import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Relay from 'react-relay'
// import {profileRoute, profileOptions} from 'config/auth0'
// import store from 'store'
import ReduxProvider from './ReduxProvider'
import Home from './Home'
import Profile from './Profile'
import Projects from './Projects'
import Tribe from './Tribe'
import Admin from './Admin'


const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

//this is messed up right now
// const checkPermissions = async (nextState, replace) => {
//   try {
//
//     const errorMessage = "Sorry, you're not logged in."
//
//     const idToken = store.getState().auth['id_token']
//
//
//
//     if (!idToken) throw errorMessage
//
//     const options = profileOptions(idToken)
//
//     const result = await fetch(profileRoute, options ).then((response) => {
//       if (!response.ok) {
//         throw response.json()
//       } else {
//         return response.json()
//       }
//     }).then(json => json)
//
//     console.log('result', result)
//
//   } catch (error) {
//     let errorResult = error.then(json=>json)
//     console.log('error result', errorResult)
//     replace({
//       pathname: '/'
//     })
//   }
// }

const createRoutes = () => {
  return (
    <Route
      path="/"
      component={ReduxProvider}
    >
      <IndexRoute
        component={Home}
        queries={ViewerQueries}
      />

      <Route
        path="/admin"
        queries={ViewerQueries}
        component={Admin}
      />

      <Route
        path="/social/*"
        queries={ViewerQueries}
        component={Home}
      />
      <Route
        path="/:handle/projects"
        component={Projects}
      />
      <Route
        path="/:handle/tribe"
        component={Tribe}
        queries={ViewerQueries}
      />

      <Route
        path="/:handle"
        component={Profile}
        queries={ViewerQueries}
      />

    </Route>
  )
}

const Routes = createRoutes()

export default Routes
