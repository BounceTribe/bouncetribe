import React, {Component} from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import {ProjectItemSm} from 'components/ProjectItemSm'

const ProjectsContainerSm = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`

class Bounces extends Component {

  edgeFilter = (project, type) => (
    project.comments.edges.filter( (edge) =>
      edge.node.type === type
    )
  )

  makeList = () => {
    let User = this.props.viewer.User
    let bounced = User.comments.edges.filter(edge => edge.node.type === 'BOUNCE')
    return bounced.comments.edges.map(edge => {
      let {node:project} = edge
      if (project.privacy === 'PRIVATE') {
        return null //shouldnt have been able to bounce a private project anyway
      } else {
        let comments = this.edgeFilter(project, 'COMMENT')
        let likes = this.edgeFilter(project, 'LIKE')
        return (
          <ProjectItemSm
            key={project.id}
            user={User}
            project={project}
            comments={comments}
            likes={likes} />
        )
      }
    } )
  }

  render () {
    return (
      <ProjectsContainerSm>
        {this.makeList()}
      </ProjectsContainerSm>
    )
  }
}

export default Relay.createContainer(
  Bounces, {
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
            comments (
              first: 999
              orderBy: createdAt_ASC
            ){
              edges {
                node {
                  id
                  createdAt
                  type
                  project {
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
        }
      `,
    }
  }
)
