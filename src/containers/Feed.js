import React, {Component} from 'react'
import Relay from 'react-relay'
import Music from 'icons/Music'
import {EmptyPanel} from 'components/EmptyPanel'
import {ActivityList} from 'components/ActivityList'

let mapNodes = items => items.edges.map(edge=>edge.node)

let setCategories = (items, category) => {
  let nodes = mapNodes(items)
  console.log('items', items)
  console.log('category', category)
  console.log('nodes', nodes)
  return nodes.map(node => {
    return Object.assign(...node, {category})
  })
}

class Feed extends Component {

  componentWillMount() {
    let friends = mapNodes(this.props.viewer.user.friends)
    let comments = []
    let bounces  = []
    let projects = []
    friends.forEach(friend => {
      // let newComments = mapNodes(friends.comments)
      // newComments.map(comment => {
      //   return Object.assign(...comment, {category: 'comment'})
      // })
      comments = comments.concat(setCategories(friend.comments, 'comments'))
      bounces = bounces.concat(setCategories(friend.bounces, 'bounces'))
      projects = projects.concat(setCategories(friend.projects, 'projects'))
    })
    console.log({comments, bounces, projects});
    // friends.map(friend)
    //assume friends.length

  }

  render () {
    return <div>hi</div>
  //   let {user, User} = this.props.viewer
  //   let {comments, bounces, projects} = User
  //   let isSelf = user.id===User.id
  //   let hasActivities = comments.count + bounces.count + projects.count
  //   return (
  //     hasActivities ?
  //     <ActivityList
  //       comments={comments}
  //       bounces={bounces}
  //       projects={projects}
  //     />
  //     :
  //     <EmptyPanel
  //       icon={<Music height={113} fill={"#D3D3D3"} />}
  //       headline={isSelf ? `Everyone wants to hear it` : `No Activity Yet`}
  //       note={isSelf ? `Upload your first project!` : ``}
  //       btnLabel={isSelf ? `New Project` : ``}
  //       btnClick={()=>this.props.router.push(`/projects/${user.handle}/new`)}
  //     />
  //   )
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
          }
        }
      }
    `,
  }
})
