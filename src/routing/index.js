import React from 'react'
import Relay from 'react-relay'
import {Route, IndexRoute} from 'react-router'
import auth from 'utils/auth'
import Template from 'containers/Template'
// import Feed from 'containers/Feed'
import Profile from 'containers/Profile'
import Project from 'containers/Project'
import ProjectList from 'containers/ProjectList'
import ProjectNew from 'containers/ProjectNew'
import Tribe from 'containers/Tribe'
import TribeAll from 'containers/TribeAll'
import TribeRequests from 'containers/TribeRequests'
import TribeFind from 'containers/TribeFind'
import TribeSearchResults from 'containers/TribeSearchResults'
import Login from 'containers/Login'
import Connect from 'containers/Connect'
import Session from 'containers/Session'
import AllSessions from 'containers/AllSessions'
import NotificationList from 'containers/NotificationList'
import Dashboard from 'containers/Dashboard'

import {Loading} from 'styled/Spinner'

const ViewerQuery = {
  viewer: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', variables)}
      }
    }
  `,
}

const tribeSearch = (params, {location})=>{
  let {query} = location
  return {
    ...params,
    tribeFilter: {
      id_not: query.ownId,
      invitations_none: {
        actor: {
          id: query.ownId
        },
      },
      sentRequests_none: {
        recipient: {
          id: query.ownId
        },
      },
      handle_contains: query.handle
    }
  }
}

// const ownCommentsFilter = (params, {location}) => {
//   return {
//     ...params,
//     commentFilter: {
//       author: {
//         handle: params.handle
//       },
//       project: {
//         title: params.projectTitle,
//         creator: {
//           handle: params.userHandle
//         }
//       }
//     }
//   }
// }
//
// const commentFilter = (params, {location}) => {
//   let {query} = location
//   if (query.in) {
//     return {
//       ...params,
//       commentFilter: {
//         author: {
//           handle_in: query.in
//         },
//         project: {
//           title: params.projectTitle,
//           creator: {
//             handle: params.userHandle
//           }
//         }
//       }
//     }
//   } else {
//     return {
//       ...params,
//       commentFilter: {
//         project: {
//           title: params.projectTitle,
//           creator: {
//             handle: params.userHandle
//           }
//         }
//       }
//     }
//   }
// }

// const commentFilter = (params, {location})=>{
//   let {query} = location
//   if (query.in && query.showAll === 'false') {
//     let handleIn = []
//     if (Array.isArray(query.in)) {
//       handleIn.push(...query.in)
//     } else if (typeof query.in === 'string') {
//       handleIn.push(query.in)
//     }
//     return {
//       ...params,
//       commentFilter: {
//         author: {
//           handle_in: handleIn,
//         },
//         project: {
//           title: params.projectTitle,
//           creator: {
//             handle: params.userHandle
//           }
//         }
//       }
//     }
//   } else if (query.showAll === 'false') {
//     return {
//       ...params,
//       commentFilter: {
//         author: {
//           handle_in: [],
//         },
//         project: {
//           title: params.projectTitle,
//           creator: {
//             handle: params.userHandle
//           }
//         }
//       }
//     }
//   } else {
//     return {
//       ...params,
//       commentFilter: {
//         project: {
//           title: params.projectTitle,
//           creator: {
//             handle: params.userHandle
//           }
//         }
//       }
//     }
//   }
// }

const userOnly = (nextState, replace) => {
  if (!auth.getToken()) {
    replace({ pathname: '/login' })
  }
}

const createRoutes = () => {
  return (
    <Route
      path='/'
      component={Template}
      queries={ViewerQuery} >
      <IndexRoute
        component={Dashboard}
        queries={ViewerQuery}
        onEnter={userOnly} />
      <Route
        path={'/:tab/dash/:userHandle'}
        component={Dashboard}
        queries={ViewerQuery} />
      {/* <Route
        path={'/bounces/:userHandle'}
        component={Dashboard}
        queries={ViewerQuery}
        render={({ props }) => props ? <Dashboard {...props} /> : <Loading />} />
      <Route
        path={'/messages/:userHandle'}
        component={Dashboard}
        queries={ViewerQuery}
        render={({ props }) => props ? <Dashboard {...props} /> : <Loading />} /> */}
      <Route
        path={'/login'}
        component={Login}
        queries={ViewerQuery}
        auth={auth} />
      <Route
        path={'/connect'}
        component={Connect}
        queries={ViewerQuery}
        auth={auth} />
      <Route
        path={'/:userHandle/notificationPage'}
        component={NotificationList}
        queries={ViewerQuery} />
      <Route
        path={'/:userHandle/tribe'}
        component={Tribe}
        queries={ViewerQuery} >
        <IndexRoute
          component={TribeAll}
          queries={ViewerQuery}
          render={({ props }) => props ? <TribeAll {...props} /> : <Loading />} />
        <Route
          path={'/:userHandle/tribe/requests'}
          component={TribeRequests}
          queries={ViewerQuery}
          render={({ props }) => props ? <TribeRequests {...props} /> : <Loading />} />
      </Route>

      <Route
        path={'/:userHandle'}
        onEnter={userOnly} >

        <IndexRoute
          component={Profile}
          queries={ViewerQuery} />
        <Route
          path={'/:userHandle/tribe/find/*'}
          component={TribeFind}
          queries={ViewerQuery}
          render={({ props }) => props ? <TribeFind {...props} /> : <Loading />}
          auth={auth}
          ignoreScrollBehavior >
          <IndexRoute
            component={TribeSearchResults}
            queries={ViewerQuery}
            render={({ props }) => props ? <TribeSearchResults {...props} /> : <Loading />}
            prepareParams={tribeSearch}
            ignoreScrollBehavior />
        </Route>

        <Route
          path={'/:userHandle/projects'}
          component={ProjectList}
          queries={ViewerQuery}
          onEnter={userOnly}
          render={({ props }) => props ? <ProjectList {...props} /> : <Loading />} />
        <Route
          path={'/:ownHandle/projects/new'}
          component={ProjectNew}
          queries={ViewerQuery}
          onEnter={userOnly}
          render={({ props }) => props ? <ProjectNew {...props} /> : <Loading />} />

        <Route
          path={'/:userHandle/sessions'} >
          <IndexRoute
            onEnter={userOnly}
            component={AllSessions}
            queries={ViewerQuery}
            render={({ props }) => props ? <AllSessions {...props} /> : <Loading />} />
          <Route
            path={'/:userHandle/sessions/:project'}
            onEnter={userOnly}
            component={AllSessions}
            queries={ViewerQuery}
            render={({ props }) => props ? <AllSessions {...props} /> : <Loading />} />
          <Route
            path={'/:userHandle/sessions/:project/find'}
            onEnter={userOnly}
            component={AllSessions}
            queries={ViewerQuery}
            render={({ props }) => props ? <AllSessions {...props} /> : <Loading />} />
        </Route>

        <Route
          path={'/:userHandle/:projectTitle'}
          onEnter={userOnly}
          component={Project}
          queries={ViewerQuery}
          render={({ props }) => props ? <Project {...props} /> : <Loading />} >
          {/* <Route
            path={'/:userHandle/:projectTitle/view'}
            component={Comments}
            queries={ViewerQuery}
            prepareParams={commentFilter} />
          <Route
            path={'/:userHandle/:projectTitle/:handle'}
            component={Comments}
            queries={ViewerQuery}
            prepareParams={ownCommentsFilter} /> */}


        </Route>
        <Route
          path={'/:userHandle/session/:sessionId/:tab'}
          onEnter={userOnly}
          component={Session}
          queries={ViewerQuery}
          render={({ props }) => props ? <Session {...props} /> : <Loading />} />


      </Route>


    </Route>
  )
}

const Routing = createRoutes()

export default Routing
