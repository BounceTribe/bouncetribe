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

  edgeFilter = (project, type) => {
    return project.comments.edges.filter( (edge) =>
      edge.node.type === type
    )
  }

  makeList = () => {
    let User = this.props.viewer.User
    return User.comments.edges.map(edge => {
      let project = edge.node.project
      if (project.privacy === 'PRIVATE') {
        return null //shouldnt have been able to bounce a private project anyway
      } else {
        let comments = this.edgeFilter(project, 'COMMENT')
        let likes = this.edgeFilter(project, 'LIKE')
        return (
          <ProjectItemSm
            key={project.id}
            User={User}
            project={project}
            comments={comments}
            likes={likes}
            bounceTab />
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
              filter: {
                timestamp: -1
              }
            ){
              edges {
                node {
                  id
                  createdAt
                  project {
                    id
                    title
                    createdAt
                    artwork {url}
                    privacy
                    creator {handle}
                    comments (first: 999){
                      edges {
                        node {
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
