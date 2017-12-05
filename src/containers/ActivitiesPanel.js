import React, {Component} from 'react'
import Relay from 'react-relay'
import Music from 'icons/Music'
import {EmptyPanel} from 'components/EmptyPanel'
import {ActivityList} from 'components/ActivityList'
import {mapNodes} from 'utils/mapNodes'

class ActiviesPanel extends Component {

  render () {
    let {user, User} = this.props.viewer
    let {comments, bounces, projects} = User
    let isSelf = user.id===User.id
    let hasActivities = comments.count + bounces.count + projects.count
    return (
      hasActivities ?
      <ActivityList
        comments={mapNodes(comments)}
        bounces={mapNodes(bounces)}
        projects={mapNodes(projects)}
      />
      :
      <EmptyPanel
        icon={<Music height={113} fill={"#D3D3D3"} />}
        headline={isSelf ? `Everyone wants to hear it` : `No Activity Yet`}
        note={isSelf ? `Upload your first project!` : ``}
        btnLabel={isSelf ? `New Project` : ``}
        btnClick={()=>this.props.router.push(`/projects/${user.handle}/new`)}
      />
    )
  }
}


export default Relay.createContainer( ActiviesPanel, {
  initialVariables: { theirHandle: '' },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          handle
        }
        User (handle: $theirHandle) {
          id
          handle
          deactivated
          comments (
            first: 999
            orderBy: createdAt_ASC
          ){
            count
            edges {
              node {
                id
                createdAt
                project {
                  id
                  title
                  privacy
                  creator {
                    deactivated
                    handle
                  }
                }
              }
            }
          }
          bounces (
            first:999
            orderBy: createdAt_ASC
           ) {
              count
              edges {
                node {
                  id
                  createdAt
                  project {
                    id
                    title
                    privacy
                    creator {
                      deactivated
                      handle
                    }
                  }
                }
              }
          }
          projects (
            first: 999
            orderBy: createdAt_ASC
          ){
            count
            edges {
              node {
                id
                title
                createdAt
                privacy
                creator {
                  deactivated
                  handle
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
