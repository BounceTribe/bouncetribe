import React from 'react'
import Relay from 'react-relay'
import {Route, IndexRoute} from 'react-router'
import auth from 'utils/auth'
import Template from 'containers/Template'
import Feed from 'containers/Feed'
import Profile from 'containers/Profile'

const ViewerQuery = {
  viewer: () => Relay.QL`query { viewer }`
}

const ViewerPersonQuery = {
  viewer: () => Relay.QL`query { viewer }`,
  person: () => Relay.QL`query { viewer }`,
}

const userOnly = (nextState, replace) => {
  if (!auth.getToken() && !nextState.location.hash.includes('id_token')) {
    auth.showLock()
  }
}

const createRoutes = () => {
  return (
    <Route
      path='/'
      component={Template}
      auth={auth}
      onEnter={userOnly}
      queries={ViewerQuery}
    >
      <IndexRoute
        component={Feed}
        queries={ViewerQuery}
      />
      <Route
        path={'/:userHandle'}
        component={Profile}
        queries={ViewerPersonQuery}
      />

    </Route>
  )
}

const Routing = createRoutes()

export default Routing
