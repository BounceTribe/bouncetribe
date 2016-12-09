import React, { Component } from 'react'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import Relay from 'react-relay'
import useRelay from 'react-router-relay'
import store from 'store'
import Routes from './Routes'
import {checkLocalStorageForToken} from 'actions/auth'
import {
  RelayNetworkLayer,
  urlMiddleware
} from 'react-relay-network-layer'
// import {profileRoute, profileOptions} from 'config/auth0'

// let localToken = store.getState().auth['id_token']

const createHeaders = (localToken) => {
  if (localToken) {
    return {
      'Authorization': 'Bearer ' + localToken
    }
  } else {
    return {}
  }
}
//
// let headers = createHeaders()
//
// console.log('headers', headers)

Relay.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: (req) => process.env.REACT_APP_GRAPHQL_URL,
    }),
    next => req => {
      let localToken = localStorage.getItem('id_token')
      let headers = createHeaders(localToken)
      req.headers = {
        ...req.headers,
        ...headers
      }
      return next(req)
    },
  ],{ disableBatchQuery: true })
)

// const select = (state) => {
//   return state.auth['id_token']
// }
//
// const handleChange = () => {
//   localToken = select(store.getState())
//   if (localToken) {
//     headers = createHeaders()
//     console.log(headers)
//   } else {
//     headers = {}
//   }
// }
//
// store.subscribe(handleChange)

store.dispatch(checkLocalStorageForToken())

class Routing extends Component {
  render() {
    return (
      <Router
        environment={Relay.Store}
        routes={Routes}
        history={browserHistory}
        render={applyRouterMiddleware(useRelay)}
      />
    )
  }
}

export default Routing
