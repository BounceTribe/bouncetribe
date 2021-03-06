import React, {Component} from 'react'
import Relay from 'react-relay'
import {ActivityList} from 'components/ActivityList'
import {mapNodes} from 'utils/mapNodes'
import {EmptyPanel} from 'components/EmptyPanel'
import Tribe from 'icons/Tribe'


class Feed extends Component {
  // componentWillMount() {
  //   console.log('Feed', this.props)
  // }

  get activities() {
    let {user, allComments, allBounces, allProjects} = this.props.viewer
    let comments = mapNodes(allComments)
    let bounces  = mapNodes(allBounces)
    let projects = mapNodes(allProjects)
    let friendIds = user.friends.edges.map(edge=>edge.node.id).concat(user.id)
    let hasActivities = comments.length + bounces.length + projects.length
    return hasActivities ? {friendIds, comments, bounces, projects} : null
   }

  render () {
    let activities = this.activities
      return activities ?
      <ActivityList dash {...activities} router={this.props.router} />
      :
      <EmptyPanel
        icon={<Tribe height={93} fill={"#D3D3D3"} />}
        headline={`It's a little quiet here...`}
        note={`Invite your friends to begin building your tribe`}
        // btnLabel={`Invite Friends`}
        // btnClick={()=>this.inviteDialog()}
      />


  }
}

export default Relay.createContainer( Feed, {
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
      commentsFilter: {
        project: {
          privacy_not: 'PRIVATE',
          creator: { deactivated: false }
        },
        author: {
          friends_some: { handle: urlParams.userHandle },
          deactivated: false
        }
      },
      bouncesFilter: {
        project: {
          privacy_not: 'PRIVATE',
          creator: { deactivated: false }
        },
        bouncer: {
          friends_some: { handle: urlParams.userHandle },
          deactivated: false
        }
      },
      projectsFilter: {
        privacy_not: 'PRIVATE',
        creator: {
          friends_some: { handle: urlParams.userHandle },
          deactivated: false
        }
      }
    }
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          handle
          friends(first: 999)  { edges { node { id } } }
        }
        allComments(
          filter: $commentsFilter
          first: 10
          orderBy: createdAt_DESC
        ){
          edges {
            node {
              id
              createdAt
              text
              project {
                id
                title
                privacy
                artwork {url}
                artworkSmall {url}
                creator {
                  id
                  handle
                }
              }
              author {
                id
                handle
                portraitMini {url}
              }
            }
          }
        }
         allProjects(
          filter: $projectsFilter
          first: 10
          orderBy: createdAt_DESC
        ){
          edges {
            node {
              id
              createdAt
              title
              privacy
              artwork {url}
              artworkSmall {url}
              creator {
                id
                handle
                portraitMini {url}
              }
            }
          }
        }
        allBounces(
          filter: $bouncesFilter
          first: 10
          orderBy: createdAt_DESC
        ){
          edges {
            node {
              id
              createdAt
              project {
                title
                id
                privacy
                artwork {url}
                artworkSmall {url}
                creator {
                  id
                  handle
                }
              }
              bouncer {
                id
                handle
                portraitMini {url}
              }
            }
          }
        }
      }
    `,
  }
})


// let setCategories = (items, category) => {
//   let nodes = mapNodes(items)
//   // let avatar
//   if (category==='comment') {
//     //item.author
//   } else if (category==='bounce') {
//       //item.bouncer
//   } else if (category==='project') {
//     //item.creator
//   }
//
//   return nodes.map(node => Object.assign({...node}, {category}))
// }
