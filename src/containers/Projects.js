import React, {Component} from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import {ProjectItemSm} from 'components/ProjectItemSm'

const ProjectsContainerSm = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`

class Projects extends Component {
  edgeFilter = (project, type) => (
    project.comments.edges.filter( (edge) =>
      edge.node.type === type
    )
  )

  makeList = () => {
    let {User, user} = this.props.viewer
    return User.projects.edges.map(edge => {
      let {node:project} = edge
      if (User.id !== user.id && project.privacy === 'PRIVATE') {
        return null
      } else {
        let comments = this.edgeFilter(project, 'COMMENT')
        let likes = this.edgeFilter(project, 'LIKE')
        return (
          <ProjectItemSm
            key={project.id}
            User={User}
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
