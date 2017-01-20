import React from 'react'
import Relay from 'react-relay'
import {Route, IndexRoute} from 'react-router'
import auth from 'utils/auth'
import Template from 'containers/Template'
import Feed from 'containers/Feed'
import Profile from 'containers/Profile'
import Project from 'containers/Project'
import ProjectList from 'containers/ProjectList'
import ProjectNew from 'containers/ProjectNew'
import Tribe from 'containers/Tribe'
import TribeAll from 'containers/TribeAll'
import TribeInvites from 'containers/TribeInvites'
import TribeFind from 'containers/TribeFind'


const ViewerQuery = {
  viewer: () => Relay.QL`
    query {
      viewer
    }
  `
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
      >
        <IndexRoute
          component={Profile}
          queries={ViewerQuery}
        />
        <Route
          path={'/:userHandle/tribe'}
          component={Tribe}
          queries={ViewerQuery}
        >
          <IndexRoute
            component={TribeAll}
            queries={ViewerQuery}
          />
          <Route
            path={'/:ownHandle/tribe/invites'}
            component={TribeInvites}
            queries={ViewerQuery}
          />
          <Route
            path={'/:ownHandle/tribe/find'}
            component={TribeFind}
            queries={ViewerQuery}
          />
        </Route>
        <Route
          path={'/:ownHandle/sessions'}
        >
          <IndexRoute

          />
          <Route
            path={'/:ownHandle/sessions/find'}
          />
        </Route>
        <Route
          path={'/:userHandle/projects'}
          component={ProjectList}
          queries={ViewerQuery}
        />
        <Route
          path={'/:ownHandle/projects/new'}
          component={ProjectNew}
          queries={ViewerQuery}
        />
        <Route
          path={'/:userHandle/:projectTitle'}
        >
          <IndexRoute
            component={Project}
            queries={ViewerQuery}
          />

          <Route
            path={'/:ownHandle/:ownProject/:otherHandle/:otherProject'}
          />
        </Route>

      </Route>


    </Route>
  )
}

const Routing = createRoutes()

export default Routing
