import React, { Component } from 'react'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import Relay from 'react-relay'
import useRelay from 'react-router-relay'
import store from 'store'
import Routes from './Routes'
import {checkLocalStorageForToken} from 'actions/auth'

store.dispatch(checkLocalStorageForToken())

let localToken = store.getState().auth['id_token']

const authorization = {
  Authorization: 'Bearer ' + localToken
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(process.env.REACT_APP_GRAPHQL_URL, {
    headers: (localToken) ? {...authorization} : {}
  })
);


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
