import React, {Component} from 'react'
import Relay from 'react-relay'

class Profile extends Component {
  render () {
    console.log(this.props.person)
    return (
      <div>
        <h1>Profile</h1>
      </div>
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
        }
      `,
      person: () => Relay.QL`
        fragment on Viewer {
          User (handle: $userHandle) {
            id
            email
          }
        }
      `,
    },
  }
)
