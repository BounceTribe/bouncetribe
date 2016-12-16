import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileContainer from 'reusables/ProfileContainer'

class Profile extends Component {
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
        <ProfileContainer
          user={viewer.user}
        />
      </section>
    )
  }
}

export default Relay.createContainer(
  Profile,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            name
            email
            profilePicUrl
            handle
            summary
            experience
            website
            ${ProfileContainer.getFragment('user')}
          }
        }
      `,
    },
  }
)
