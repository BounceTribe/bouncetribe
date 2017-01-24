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

  // findProject = () => {
  //   let {
  //     title
  //   } = this.props.params
  //   const project = this.props.viewer.User.projects.edges.find( (edge)=> {
  //     return edge.node.title === title
  //   })
  //   return project.node
  // }


  render() {
    let {
      viewer,
      router
    } = this.props
    // this.findProject()
    return (
      <section>

        <SingleProjectContainer
          router={router}
          user={viewer.User}
          self={viewer.user}
          viewer={viewer}
          project={viewer.allProjects.edges[0].node}
        />
      </section>
    )
  }
}

export default Relay.createContainer(
  SingleProject, {
    initialVariables: {
      handle: '',
      title: '',
      projectFilter: {}
    },
    prepareVariables: (prevVariables) => {
      console.log(prevVariables)
      return {
        ...prevVariables,
        projectFilter: {
          title: prevVariables.title
        }
      }
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          allProjects (
            filter: $projectFilter
            first: 1
          ) {
            edges {
              node {
                title
                id
                ${SingleProjectContainer.getFragment('project')}
              }
            }
          }
          User (handle: $handle) {
            ${SingleProjectContainer.getFragment('user')}
            id
            handle
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
