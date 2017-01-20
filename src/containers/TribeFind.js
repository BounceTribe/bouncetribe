import React, {Component} from 'react'
import Relay from 'react-relay'
import {List} from 'styled'

class TribeFind extends Component {
  render () {
    return (
      <List>

      </List>
    )
  }
}

export default Relay.createContainer(
  TribeFind, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $userHandle) {
            id
            email
          }
        }
      `,
    }
  }
)
