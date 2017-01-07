import React, { Component } from 'react'
import Relay from 'react-relay'
import TribeContainer from 'reusables/TribeContainer'

class Tribe extends Component {
  // constructor() {
  //   super()
  //
  // }

  get ownProjects () {
    let {
      user,
      User
    } = this.props.viewer
    console.log('ownProjects', this.props.viewer)
    if (user.id === User.id) {
      return true
    } else {
      return false
    }
  }


  render() {
    const {
      viewer,
      router
    } = this.props
    return (
        <TribeContainer
          user={viewer.User}
          self={viewer.user}
          ownProfile={this.ownProfile}
          viewer={viewer}
          router={router}
        />
    )
  }
}

export default Relay.createContainer(
  Tribe,
  {
    initialVariables: {
      handle: '',
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
            placename
            longitude
            latitude
            ${TribeContainer.getFragment('user')}
          }
          user {
            id
          }
          ${TribeContainer.getFragment('viewer')}
        }
      `,
    },
  }
)
