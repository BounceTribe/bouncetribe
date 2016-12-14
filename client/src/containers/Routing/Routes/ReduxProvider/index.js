import React, {Component} from 'react'
import {Provider} from 'react-redux'
import store from 'store'
import UI from '../UI'

class ReduxProvider extends Component {
  render() {
    return (
        <Provider
          store={store}
        >
          <UI
            children={this.props.children}
            router={this.props.router}
          />
        </Provider>

    )
  }
}


export default ReduxProvider
