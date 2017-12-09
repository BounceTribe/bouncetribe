import React, {Component} from 'react'
import Relay from 'react-relay'
import {ActivityList} from 'components/ActivityList'
import {mapNodes} from 'utils/mapNodes'

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


class Feed extends Component {
  componentWillMount() {
    console.log('Feed', this.props)
  }

  get activities() {
    let comments = mapNodes(this.props.viewer.allComments)
    let bounces  = mapNodes(this.props.viewer.allBounces)
    let projects = mapNodes(this.props.viewer.allProjects)
    console.log({comments, bounces, projects});
    return {comments, bounces, projects}
   }

  render () {
    return <ActivityList {...this.activities} dash router={this.props.router}/>
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
        author: {
          friends_some: { handle: urlParams.userHandle, deactivated: false }
        }
      },
      bouncesFilter: {
        bouncer: {
          friends_some: { handle: urlParams.userHandle, deactivated: false }
        }
      },
      projectsFilter: {
        privacy_not: 'PRIVATE',
        creator: {
          friends_some: { handle: urlParams.userHandle, deactivated: false }
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
                title
                privacy
                artwork {url}
                creator {
                  id
                  handle
                }
              }
              author {
                id
                handle
                portrait {url}
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
              creator {
                id
                handle
                portrait {url}
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
                privacy
                artwork {url}
                creator {
                  id
                  handle
                }
              }
              bouncer {
                id
                handle
                portrait {url}
              }
            }
          }
        }
      }
    `,
  }
})
