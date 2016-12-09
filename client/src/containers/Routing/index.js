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

const createHeaders = (localToken) => {
  if (localToken) {
    return {
      Authorization: 'Bearer ' + localToken
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
