import React from 'react'
import Relay from 'react-relay'
import {Route, IndexRoute} from 'react-router'
import auth from 'utils/auth'
import Template from 'containers/Template'
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
import Projects from 'containers/Projects'
import DirectMessages from 'containers/DirectMessages'
// import Bounces from 'containers/Bounces'
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

const userOnly = (nextState, replace) => {
  if (!auth.getToken()) {
    replace({ pathname: '/login' })
  }
}

const createRoutes = () => (
  <Route
    path='/'
    component={Template}
    queries={ViewerQuery} >
    <IndexRoute component={Dashboard}
      queries={ViewerQuery}
      onEnter={userOnly}
      render={({ props }) => props ? <Dashboard {...props} /> : <Loading />} />
    <Route path={'/login'} component={Login} queries={ViewerQuery} auth={auth} />
    <Route path={'/connect'} component={Connect} queries={ViewerQuery} auth={auth} />
    <Route path={'/notifications'}
      component={NotificationList}
      queries={ViewerQuery}
      render={({ props }) => props ? <NotificationList {...props} /> : <Loading />} />
    <Route path={'/sessions/:userHandle'} onEnter={userOnly}>
      <IndexRoute
        component={AllSessions}
        queries={ViewerQuery}
        render={({ props }) => props ? <AllSessions {...props} /> : <Loading nested />} />
      <Route
        path={'/sessions/:userHandle/:project'}
        component={AllSessions}
        queries={ViewerQuery}
        render={({ props }) => props ? <AllSessions {...props} /> : <Loading nested />} />
      <Route
        path={'/sessions/:userHandle/:project/find'}
        component={AllSessions}
        queries={ViewerQuery}
        render={({ props }) => props ? <AllSessions {...props} /> : <Loading nested />} />
    </Route>
    <Route path={'/projects/:userHandle'}
      component={ProjectList}
      queries={ViewerQuery}
      onEnter={userOnly}
      render={({ props }) => props ? <ProjectList {...props} /> : <Loading />} />
    <Route path={'/projects/:ownHandle/new'}
      component={ProjectNew}
      queries={ViewerQuery}
      onEnter={userOnly}
      render={({ props }) => props ? <ProjectNew {...props} /> : <Loading />} />

    <Route path='/dash' component={Dashboard} queries={ViewerQuery} >
      <Route path={'/dash/projects/:userHandle'}
        component={Projects}
        queries={ViewerQuery}
        render={({ props }) => props ? <Projects {...props} /> : <Loading nested />} />
      <Route path={'/dash/messages/:userHandle'}
        component={DirectMessages}
        queries={ViewerQuery}
        render={({ props }) => props ? <DirectMessages {...props} /> : <Loading nested />} />
      {/* <Route path={'/dash/bounces/:userHandle'}
        component={Bounces}
        queries={ViewerQuery}
        render={({ props }) => props ? <Bounces {...props} /> : <Loading nested/>} /> */}
    </Route>

    <Route path={'/:userHandle'}
      onEnter={userOnly}
      component={Profile}
      queries={ViewerQuery}
      render={({ props }) => props ? <Profile {...props} /> : <Loading/>} >
      <Route path={'/:userHandle/projects'}
        component={Projects}
        queries={ViewerQuery}
        render={({ props }) => props ? <Projects {...props} /> : <Loading nested/>} />
      {/* <Route path={'/:userHandle/bounces'}
        component={Bounces}
        queries={ViewerQuery}
        render={({ props }) => props ? <Bounces {...props} /> : <Loading nested/>} />
      <Route path={'/:userHandle/activity'}
        component={Activities}
        queries={ViewerQuery}
        render={({ props }) => props ? <Activities {...props} /> : <Loading nested/>} /> */}
    </Route>
    <Route path={'/tribe/:userHandle'}
      component={Tribe}
      queries={ViewerQuery}
      render={({ props }) => props ? <Tribe {...props} /> : <Loading />} >
      <IndexRoute component={TribeAll}
        queries={ViewerQuery}
        render={({ props }) => props ? <TribeAll {...props} /> : <Loading nested />} />
      <Route path={'/tribe/:userHandle/requests'}
        component={TribeRequests}
        queries={ViewerQuery}
        render={({ props }) => props ? <TribeRequests {...props} /> : <Loading nested/>} />
    </Route>
    <Route path={'/tribe/:userHandle/find/*'}
      component={TribeFind}
      queries={ViewerQuery}
      render={({ props }) => props ? <TribeFind {...props} /> : <Loading />}
      auth={auth}
      ignoreScrollBehavior >
      <IndexRoute
        component={TribeSearchResults}
        queries={ViewerQuery}
        render={({ props }) => props ? <TribeSearchResults {...props} /> : <Loading nested/>}
        prepareParams={tribeSearch}
        ignoreScrollBehavior />
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
        path={'/session/:userHandle/:sessionId/:tab'}
        onEnter={userOnly}
        component={Session}
        queries={ViewerQuery}
        render={({ props }) => props ? <Session {...props} /> : <Loading />} />
    </Route>


)

const Routing = createRoutes()

export default Routing


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
