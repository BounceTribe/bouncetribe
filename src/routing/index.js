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
import Login from 'containers/Login'
import AudioPlayer from 'components/AudioPlayer'

const ViewerQuery = {
  viewer: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', variables)}
      }
    }
  `,
}

// const NodeQuery = {
//   node: (Component, variables) => Relay.QL`
//     query {
//       node: node(id: $id) {
//         ${Component.getFragment('node', variables)}
//       }
//     }
//   `,
// }
//
// const NodeParams = (params,router) => {
//   return {
//     ...params,
//     id: ''
//   }
// }

const userOnly = (nextState, replace) => {
  if (!auth.getToken()) {
    replace({
      pathname: '/login'
    })
  }
}

const createRoutes = () => {
  return (
    <Route
      path='/'
      component={Template}
      queries={ViewerQuery}
    >
      <IndexRoute
        component={Feed}
        queries={ViewerQuery}
        onEnter={userOnly}
      />

      <Route
        path={'/login'}
        component={Login}
        queries={ViewerQuery}
        auth={auth}
      />

      <Route
        path={'/:userHandle'}
        onEnter={userOnly}
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
          onEnter={userOnly}
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
          onEnter={userOnly}
        />
        <Route
          path={'/:ownHandle/projects/new'}
          component={ProjectNew}
          queries={ViewerQuery}
          onEnter={userOnly}
        >
          <Route
            path={'/:ownHandle/projects/new/:trackId'}
            component={AudioPlayer}
            queries={ViewerQuery}
          />
        </Route>
        <Route
          path={'/:userHandle/:projectTitle'}
          onEnter={userOnly}
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
