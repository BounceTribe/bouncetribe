import React, {Component} from 'react'
import Relay from 'react-relay'
import {ActivityList} from 'components/ActivityList'
import {mapNodes} from 'utils/mapNodes'

let setCategories = (items, category) => {
  let nodes = mapNodes(items)
  let avatar
  if (category==='comment') {
    //item.author 
  } else if (category==='bounce') {
      //item.bouncer
  } else if (category==='project') {
    //item.creator
  }

  return nodes.map(node => Object.assign({...node}, {category}))
}


class Feed extends Component {
  get activities() {
    let friends = mapNodes(this.props.viewer.user.friends)
    let comments = []
    let bounces  = []
    let projects = []
    friends.forEach(friend => {
      comments = comments.concat(setCategories(friend.comments, 'comment'))
      bounces = bounces.concat(setCategories(friend.bounces, 'bounce'))
      projects = projects.concat(setCategories(friend.projects, 'project'))
    })
    console.log({comments, bounces, projects});
    return {comments, bounces, projects}
  }

  render () {
    return <ActivityList {...this.activities} dash />
  }
}

export default Relay.createContainer( Feed, {
  initialVariables: { theirHandle: '' },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          handle
          friends (first: 999){
            edges {
              node {
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
                      author {
                        handle
                      }
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
                        bouncer {
                          handle
                        }
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
          }
        }
      }
    `,
  }
})
