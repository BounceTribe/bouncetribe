import React, { Component } from 'react'
import Relay from 'react-relay'
import TribeContainer from 'reusables/TribeContainer'

class Tribe extends Component {
  // constructor() {
  //   super()
  //
  // }

  render() {
    const {
      viewer,
      router
    } = this.props
    return (
      <section>

        <TribeContainer
          user={viewer.user}
          viewer={viewer}
          router={router}
        />

      </section>
    )
  }
}

export default Relay.createContainer(
  Tribe,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            ${TribeContainer.getFragment('user')}
          }
          ${TribeContainer.getFragment('viewer')}
        }
      `,
    },
  }
)
