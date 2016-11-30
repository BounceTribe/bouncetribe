import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Relay from 'react-relay'

import ReduxProvider from './ReduxProvider'

import Home from './Home'
import Profile from './Profile'
import Users from './Users'

const ViewerQueries = {
  viewer: () => Relay.QL`
    query {
      viewer
    }
  `,
}

const createRoutes = () => {
  return (
    <Route path="/" component={ReduxProvider}>
      <IndexRoute component={Home} />
      <Route
        path="/profile"
        component={Profile}
      />
      <Route
        path="/users"
        component={Users}
        queries={ViewerQueries}
      />
    </Route>
  )
}

const Routes = createRoutes()

export default Routes
