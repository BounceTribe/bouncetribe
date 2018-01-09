import React from 'react'
import ReactDOM from 'react-dom'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import Routing from 'routing'
import Relay from 'react-relay/classic'
import useRelay from 'react-router-relay'
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer'
import {graphCool} from 'config'
import auth from 'utils/auth'



const createHeaders = (idToken) => {
  if (idToken) {
    return {
      Authorization: 'Bearer ' + idToken
    }
  } else {
    return {}
  }
}

Relay.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: (req) => graphCool.relay,
    }),
    next => req => {
      let idToken = auth.getToken()
      let headers = createHeaders(idToken)
      req.headers = {
        ...req.headers,
        ...headers
      }
      return next(req)
    },
  ],{ disableBatchQuery: true })
)

ReactDOM.render(
  <Router
    environment={Relay.Store}
    render={applyRouterMiddleware(useRelay)}
    history={browserHistory}
    routes={Routing}
  />,
  document.getElementById('root')
)
