import React, { Component } from 'react'
import Relay from 'react-relay'
import SingleProjectContainer from 'reusables/SingleProjectContainer'


class SingleProject extends Component {

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

  findProject = () => {
    let {
      title
    } = this.props.params
    const project = this.props.viewer.User.projects.edges.find( (edge)=> {
      return edge.node.title === title
    })
    return project.node
  }


  render() {
    let {
      viewer,
      router
    } = this.props
    this.findProject()
    return (
      <section>

        <SingleProjectContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          viewer={viewer}
          project={this.findProject()}
        />
      </section>
    )
  }
}

export default Relay.createContainer(
  SingleProject, {
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
            ${SingleProjectContainer.getFragment('user')}
            projects (first: 2147483647) {
              edges {
                node {
                  title
                  id
                  description
                  privacy
                  new
                  artwork {
                    url
                  }
                  tracks (first: 2147483647) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
          user {
            id
          }
          id
        }
      `,
    },
  }
)
