import React, {Component} from 'react'
import Relay from 'react-relay'
import {List} from 'styled/list'

class TribeFind extends Component {

  get userList () {
    //let allUsers = this.props.viewer.allUsers.edges.map
  }

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
      ownHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $ownHandle) {
            id
            email
          }
        }
      `,
    }
  }
)
