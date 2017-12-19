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
import NotificationList from 'containers/NotificationList'
import Dashboard from 'containers/Dashboard'
import ProjectsPanel from 'containers/ProjectsPanel'
import DirectMessages from 'containers/DirectMessages'
import PagedFeed from 'containers/PagedFeed'
import BouncesPanel from 'containers/BouncesPanel'
import ActivitiesPanel from 'containers/ActivitiesPanel'
import {Loading} from 'styled/Spinner'
//sublime id: acceptinvite/cj5jwswj4cjyx0161fik5z7pv

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
      deactivated: false,
      invitations_none: {
        actor: {id: query.ownId},
      },
      sentRequests_none: {
        recipient: {id: query.ownId},
      },
      handle_contains: query.handle
    }
  }
}

const userOnly = (nextState, replace) => {
  //look furtherinto the auth gettoken function
  //verify
  // console.log(' nextState', nextState, 'replace', replace);
  if (!auth.getToken()) {
    console.log('no token (routes)');
    let path = nextState.location.pathname
    if ((path !== ('/login/' || '/login')))
      localStorage.setItem('redirect', path)
    replace({ pathname: '/login/'})
  }
}

const createRoutes = () => (

  <Route path={'/'}
    component={Template}
    queries={ViewerQuery} >
    <Route path={'/login'} component={Login} queries={ViewerQuery} auth={auth} />
    <Route path={'/connect'} component={Connect} queries={ViewerQuery} auth={auth} />
    <Route path={'/acceptrequest/:inviteId/:newFriendId'} onEnter={userOnly} auth={auth}/>
    <Route path={'/acceptinvite/:newFriendId'} onEnter={userOnly} auth={auth}/>
    <Route path={'/unsubscribe'} onEnter={userOnly} auth={auth}/>
    <Route path={'/notifications'}
      component={NotificationList}
      queries={ViewerQuery}
      render={({props}) => props ? <NotificationList {...props} /> : <Loading />} />
    <Route path={'/projects/:theirHandle'}
      component={ProjectList}
      queries={ViewerQuery}
      onEnter={userOnly}
      render={({props}) => props ? <ProjectList {...props} /> : <Loading />} />
    <Route path={'/projects/:ownHandle/new'}
      component={ProjectNew}
      queries={ViewerQuery}
      onEnter={userOnly}
      render={({props}) => props ? <ProjectNew {...props} /> : <Loading />} />

    <Route path='/dash'
      component={Dashboard}
      queries={ViewerQuery}
      render={({props}) => props ? <Dashboard {...props} /> : <Loading />} >
      <Route path='/dash/feed/:userHandle(/:page)'
        // prepareParams={({page}) => {
        //   console.log('prep', page);
        //   return {page: parseInt(page, 10)}
        // }}
        component={PagedFeed}
        queries={ViewerQuery}
        // render={({props}) => props ? <PagedFeed {...props} /> : <Loading nested />} />
      />
      <Route path='/dash/:theirHandle/projects/:userHandle(/:page)'
        component={ProjectsPanel}
        queries={ViewerQuery}
        render={({props}) => props ? <ProjectsPanel {...props} /> : <Loading nested />} />
      <Route path={'/dash/:theirHandle/messages/:userHandle(/:page)'}
        component={DirectMessages}
        queries={ViewerQuery}
        // render={({props}) => props ? <DirectMessages {...props} /> : <Loading nested />} />
      />
      <Route path={'/dash/:theirHandle/bounces/:userHandle(/:page)'}
        component={BouncesPanel}
        queries={ViewerQuery}
        render={({props}) => props ? <BouncesPanel {...props} /> : <Loading nested/>} />
    </Route>

    <Route path={'/:theirHandle'}
      onEnter={userOnly}
      component={Profile}
      queries={ViewerQuery}
      render={({props}) => props ? <Profile {...props} /> : <Loading/>} >
      <Route path={'/:theirHandle/projects'}
        component={ProjectsPanel}
        onEnter={userOnly}
        queries={ViewerQuery}
        render={({props}) => props ? <ProjectsPanel {...props} /> : <Loading nested/>} />
       <Route path={'/:theirHandle/bounces'}
        onEnter={userOnly}
        component={BouncesPanel}
        queries={ViewerQuery}
        render={({props}) => props ? <BouncesPanel {...props} /> : <Loading nested/>} />
      <Route path={'/:theirHandle/activity(/:page)'}
        component={ActivitiesPanel}
        queries={ViewerQuery}
        render={({props}) => props ? <ActivitiesPanel {...props} /> : <Loading nested/>} />
    </Route>
    <Route path={'/tribe/:theirHandle/(members)'}
      component={Tribe}
      queries={ViewerQuery}
      render={({props}) => props ? <Tribe {...props} /> : <Loading />} >
      <IndexRoute
        component={TribeAll}
        queries={ViewerQuery}
        render={({props}) => props ? <TribeAll {...props} /> : <Loading nested />} />
      <Route path={'/tribe/:theirHandle/requests(/:acceptFriendId)'}
        component={TribeRequests}
        queries={ViewerQuery}
        render={({props}) => props ? <TribeRequests {...props} /> : <Loading nested/>} />
    </Route>
    <Route path={'/tribe/:theirHandle/find/*(/)'}
      component={TribeFind}
      queries={ViewerQuery}
      render={({props}) => props ? <TribeFind {...props} /> : <Loading />}
      auth={auth}
      ignoreScrollBehavior >
      <IndexRoute
        component={TribeSearchResults}
        queries={ViewerQuery}
        render={({props}) => props ? <TribeSearchResults {...props} /> : <Loading nested/>}
        prepareParams={tribeSearch}
        ignoreScrollBehavior />
    </Route>
    <Route
      path={'/:theirHandle/:projectTitle'}
      onEnter={userOnly}
      component={Project}
      queries={ViewerQuery}
      render={({props}) => props ? <Project {...props} /> : <Loading />} >
    </Route>
    {/* <Route
      path={'/:theirHandle/:projectTitle'}
      onEnter={userOnly}
      component={Project}
      queries={ViewerQuery}
      render={({props}) => props ? <Project {...props} /> : <Loading />} >
      {/* <Route
        path={'/:theirHandle/:projectTitle/view'}
        component={Comments}
        queries={ViewerQuery}
        prepareParams={commentFilter} />
      <Route
        path={'/:theirHandle/:projectTitle/:handle'}
        component={Comments}
        queries={ViewerQuery}
        prepareParams={ownCommentsFilter} /> */}
      {/* </Route> */}
      {/* <Route
        path={'/session/:theirHandle/:sessionId/:tab'}
        onEnter={userOnly}
        component={Session}
        queries={ViewerQuery}
        render={({props}) => props ? <Session {...props} /> : <Loading />} /> */}
    </Route>


)

const Routing = createRoutes()

export default Routing

/* <IndexRoute component={Dashboard}
  queries={ViewerQuery}
  onEnter={userOnly}
  auth={auth}
  render={({props}) => props ? <Dashboard {...props} /> : <Loading />} /> */

/* <Route path={'/sessions/:theirHandle'} onEnter={userOnly}>
  <IndexRoute
    component={AllSessions}
    queries={ViewerQuery}
    render={({props}) => props ? <AllSessions {...props} /> : <Loading nested />} />
  <Route
    path={'/sessions/:theirHandle/:project'}
    component={AllSessions}
    queries={ViewerQuery}
    render={({props}) => props ? <AllSessions {...props} /> : <Loading nested />} />
  <Route
    path={'/sessions/:theirHandle/:project/find'}
    component={AllSessions}
    queries={ViewerQuery}
    render={({props}) => props ? <AllSessions {...props} /> : <Loading nested />} />
</Route> */


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
//           handle: params.theirHandle
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
//             handle: params.theirHandle
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
//             handle: params.theirHandle
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
//             handle: params.theirHandle
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
//             handle: params.theirHandle
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
//             handle: params.theirHandle
//           }
//         }
//       }
//     }
//   }
// }
