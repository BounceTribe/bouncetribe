import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileContainer from 'reusables/ProfileContainer'

class Profile extends Component {

  get ownProfile () {
    let {
      user,
      User
    } = this.props.viewer
    if (user.id === User.id) {
      return true
    } else {
      return false
    }
  }

  render() {
    let {
      viewer,
      router
    } = this.props
    return (
      <section>
        <ProfileContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          ownProfile={this.ownProfile}
        />
      </section>
    )
  }
}

export default Relay.createContainer(
  Profile, {
    initialVariables: {
      handle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          User (handle: $handle) {
            id
            name
            email
            profilePicUrl
            handle
            summary
            experience
            website
            ${ProfileContainer.getFragment('user')}
          }
          user {
            id
          }
        }
      `,
    },
  }
)
