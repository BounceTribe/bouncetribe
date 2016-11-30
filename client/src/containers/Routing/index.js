import React, { Component } from 'react'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import Relay from 'react-relay'
import useRelay from 'react-router-relay'

import Routes from './Routes'
import store from 'store'
import {API_URL} from 'config/api'


let localToken = store.getState().auth.user['id_token']

const authorization = {
  Authorization: 'Bearer ' + localToken
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(API_URL, {
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
