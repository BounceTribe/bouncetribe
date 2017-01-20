import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'

class Profile extends Component {
  render () {
    return (
      <View>
        <h1>Profile</h1>
        {this.props.children}
      </View>
    )
  }
}

export default Relay.createContainer(
  Profile, {
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