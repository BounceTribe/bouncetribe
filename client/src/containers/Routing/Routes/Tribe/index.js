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
      viewer
    } = this.props
    return (
      <section>
        <h1>Tribe</h1>

        <TribeContainer
          user={viewer.user}
          viewer={viewer}
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
