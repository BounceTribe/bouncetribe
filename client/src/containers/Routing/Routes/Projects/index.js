import React, { Component } from 'react'
import Relay from 'react-relay'
import ProjectsContainer from 'reusables/ProjectsContainer'
import SingleProjectContainer from 'reusables/SingleProjectContainer'


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

  showListOrSingle = () => {
    let {
      viewer,
      router
    } = this.props
    if (router.location.pathname === `/${router.params.handle}/projects`) {
      return (
        <ProjectsContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          ownProjects={this.ownProjects}
        />
      )
    } else {
      return (
        <SingleProjectContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          ownProjects={this.ownProjects}
          project={null}
          projectId={this.props.relay.variables.projectId}
        />
      )
    }
  }

  render() {
    console.log('project', this.props)
    return (
      <section>

        {this.showListOrSingle()}
      </section>
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
