import React, { Component } from 'react'
import Relay from 'react-relay'
import ProjectsContainer from 'reusables/ProjectsContainer'
import ProjectContainer from 'reusables/ProjectContainer'

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
    console.log(router)
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
        <ProjectContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          ownProjects={this.ownProjects}
        />
      )
    }
  }

  render() {
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
            placename
            longitude
            latitude
            ${ProjectsContainer.getFragment('user')}
            ${ProjectContainer.getFragment('user')}
          }
          user {
            id
          }
        }
      `,
    },
  }
)
