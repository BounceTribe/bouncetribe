import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Relay from 'react-relay'
// import store from 'store'
// import {loadUserFromLocalStorage} from 'actions/auth'

import ReduxProvider from './ReduxProvider'

import Home from './Home'
import ProfileContainer from 'reusables/ProfileContainer'
// import Admin from './Admin'
import Projects from './Projects'
import Tribe from './Tribe'


const ViewerQueries = {
  viewer: () => Relay.QL`
    query {
      viewer
    }
  `,
}

// const requireAuth = (nextState, replace) => {
//   store.dispatch(loadUserFromLocalStorage())
//   const isLoggedIn = store.getState().auth.user
//   if (!isLoggedIn) {
//     console.log('you need to login')
//     replace({ pathname: '/' })
//   }
// }


const createRoutes = () => {
  return (
    <Route path="/" component={ReduxProvider}>
      <IndexRoute component={Home} />
      <Route
        path="/profile"
        component={ProfileContainer}
        queries={ViewerQueries}
      />
      <Route
        path="/projects"
        component={Projects}
      />
      <Route
        path="/tribe"
        component={Tribe}
      />
      {/* <Route
        path="/admin"
        component={Admin}
        queries={ViewerQueries}
      /> */}
    </Route>
  )
}

const Routes = createRoutes()

export default Routes
