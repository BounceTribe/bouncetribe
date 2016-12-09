import React, {Component} from 'react'
import {Provider} from 'react-redux'
import store from 'store'
import UI from '../UI'
import Relay from 'react-relay'
import AuthContainer from 'reusables/AuthContainer'

class ReduxProvider extends Component {
  render() {
    return (
        <Provider
          store={store}
        >
          <UI
            children={this.props.children}
            router={this.props.router}
            viewer={this.props.viewer}
          />
        </Provider>

    )
  }
}


export default Relay.createContainer(
  ReduxProvider,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          ${AuthContainer.getFragment('viewer')}
          user {
            handle
          }
        }
      `,
    },
  }
)
