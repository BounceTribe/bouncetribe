import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectItemSm} from 'components/ProjectItemSm'

class Projects extends Component {

  render () {
    let {User, user} = this.props.viewer

    console.log('PROJECTS VIEWER', this.props);

    return (
      <div>{User.projects.edges.map(edge => {
      let {node:project} = edge
      if (User.id !== user.id && project.privacy === 'PRIVATE') {
        return null
      } else {
        let comments = project.comments.edges.filter( (edge) => {
          return edge.node.type === 'COMMENT'
        })
        let likes = project.comments.edges.filter( (edge) => {
          return edge.node.type === 'LIKE'
        })
        return (
          <ProjectItemSm key={project.id} users={{User, user}} project={project} comments={comments} likes={likes} />
        )
      }
    } )}</div>
    )
  }

}

export default Relay.createContainer(
  Projects, {
    initialVariables: { userHandle: '' },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $userHandle) {
            id
            handle
            projects (
              first: 5
              orderBy: createdAt_ASC
            ){
              edges {
                node {
                  id
                  title
                  createdAt
                  artwork { url }
                  privacy
                  comments ( first: 999 ) {
                    edges {
                      node {
                        id
                        type
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }
  }
)
