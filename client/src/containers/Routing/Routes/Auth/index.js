import React, { Component } from 'react'
import Relay from 'react-relay'
import AuthContainer from 'reusables/AuthContainer'

class Auth extends Component {
  // constructor() {
  //   super()
  //
  // }

  render() {
    const {
      viewer
    } = this.props
    return (
      <section>
        <AuthContainer
          viewer={viewer}
          router={this.props.router}
        />
      </section>
    )
  }
}

export default Relay.createContainer(
  Auth,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          ${AuthContainer.getFragment('viewer')}
        }
      `,
    },
  }
)
