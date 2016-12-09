import React, { Component } from 'react'
import Relay from 'react-relay'
import SettingsContainer from 'reusables/SettingsContainer'

class Settings extends Component {
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
        <h1>Settings</h1>

        <SettingsContainer
          user={viewer.user}
        />

      </section>
    )
  }
}

export default Relay.createContainer(
  Settings,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            email
            name
            handle
            ${SettingsContainer.getFragment('user')}
          }
        }
      `,
    },
  }
)
