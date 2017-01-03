import React, { Component } from 'react'
import Relay from 'react-relay'
import ProjectsContainer from 'reusables/ProjectsContainer'


class Projects extends Component {

  get ownProjects () {
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
      router,
      viewer
    } = this.props
    return (
        <ProjectsContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          ownProjects={this.ownProjects}
        />
    )
  }
}

export default Relay.createContainer(
  Projects, {
    initialVariables: {
      handle: '',
      title: false,
      projectIdExists: false,
      projectId: '',
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
            ${ProjectsContainer.getFragment('user')}
          }
          user {
            id
          }
        }
      `,
    },
  }
)
