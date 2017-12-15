import React, {Component} from 'react'
import Relay from 'react-relay'
import Music from 'icons/Music'
import {EmptyPanel} from 'components/EmptyPanel'
import {ActivityList} from 'components/ActivityList'
import {mapNodes} from 'utils/mapNodes'

class ActiviesPanel extends Component {

// console.log('filteredcomments', mapNodes(comments).filter(comment=>comment.project).map(c=>Object.assign(c, {user: User.id})));
  render () {
    let {user, User} = this.props.viewer
    let {comments, bounces, projects} = User

    console.log({User});
    let isSelf = user.id===User.id
    let hasActivities = mapNodes(comments).filter(comment=>comment.project).length + bounces.count + projects.count
    return (
      hasActivities ?
      <ActivityList
        comments={mapNodes(comments).filter(comment=>comment.project)}
        bounces={mapNodes(bounces)}
        projects={mapNodes(projects)}
        friendIds={user.friends.edges.map(edge=>edge.node.id).concat(user.id)}
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
  initialVariables: {
    theirHandle: '',
    userHandle: '',
    bouncesFilter: {},
    commentsFilter: {},
    projectsFilter: {}
  },
  prepareVariables: (urlParams) => {
    return {
      ...urlParams,
      //ensures non-deleted projects as well
      commentsFilter: {
        project: {
          privacy_not: 'PRIVATE',
          creator: { deactivated: false }
        },
      },
      bouncesFilter: {
        project: {
          privacy_not: 'PRIVATE',
          creator: { deactivated: false }
        },
      },
      projectsFilter: {
        privacy_not: 'PRIVATE',
        creator: { deactivated: false }
      }
      // use similiar filters for comments, bounces (if project changes privacy)
      // projectsFilter: { OR:
      //   [ {
      //     privacy_not: 'PRIVATE',
      //   }, {
      //     privacy: 'TRIBE',
      //     creator: {
      //       friends_some: { handle: urlParams.userHandle }
      //     },
      //   }
      // ] }
    }
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          handle
          friends(first: 999) { edges { node { id } } }
        }
        User (handle: $theirHandle) {
          id
          handle
          deactivated
          comments (
            first: 20
            orderBy: createdAt_ASC
            filter: $commentsFilter
          ){
            count
            edges {
              node {
                id
                author {id}
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
            first: 20
            orderBy: createdAt_ASC
            filter: $bouncesFilter
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
            first: 20
            orderBy: createdAt_ASC
            filter: $projectsFilter
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
