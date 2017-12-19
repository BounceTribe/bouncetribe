import React, {Component} from 'react'
import Relay from 'react-relay'
import {ActivityList} from 'components/ActivityList'
import {mapNodes} from 'utils/mapNodes'
import {EmptyPanel} from 'components/EmptyPanel'
import Tribe from 'icons/Tribe'
import {SeeMore} from 'styled'


class Feed extends Component {

  constructor(props) {
    super(props)
    let {user} = this.props.viewer
    this.state = Object.assign(
      this.mapActivity(this.props), {
        loading: false,
        friendIds: user.friends.edges.map(edge=>edge.node.id).concat(user.id),
        listLength: 0,
        oldNum:0,
      }
    )
    console.log('state', this.state);
  }

  componentWillMount() {
    console.log('Feed', this.props)
    if (this.props.params.page > 1) {
      this.setPage(this.props, 1)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      Object.assign( this.mapActivity(nextProps), {loading: false} )
    )
    console.log('feed state', this.state);
    // debugger
  }

  mapActivity = (props) => {
    let {allComments, allBounces, allProjects} = props.viewer
    
    let numOldComments = (this.state.allComments || []).length
    let numOldBounces = (this.state.allBounces || []).length
    let numOldProjects = (this.state.allProjects || []).length
    // let newComments = allComments.filter()
    // let newComments = allComments(numOldComments-allComments.length,allComments.length-1)
    let comments = mapNodes(allComments)
    let bounces  = mapNodes(allBounces)
    let projects = mapNodes(allProjects)

    let newComments = comments(numOldComments-1, comments.length-1)
    let newBounces = comments(numOldBounces-1, bounces.length-1)
    let newProjects = comments(numOldProjects-1, projects.length-1)
    let numActivities = comments.length + bounces.length + projects.length
    let totalActivities = allComments.count + allBounces.count + allProjects.count
    return {
      comments,
      bounces,
      projects,
      newComments,
      newBounces,
      newProjects,
      numActivities,
      totalActivities,
      hasMore: totalActivities > numActivities
    }
  }

  setPage = (props, newPage) => {
    let {userHandle, page} = props.params
    if (!newPage) newPage = parseInt((page || 1), 10) + 1
    let newPath = `/dash/feed/${userHandle}/${newPage}/`
    this.props.router.replace(newPath)
  }

   seeMore = () => {
     !this.state.loading && this.setState({loading: true})
     this.setPage(this.props)
   }

  // compareListLength = (newLength) => {
  //   if (newLength===this.state.listLength) {
  //     this.seeMore()
  //   } else {
  //     this.setState({listLength: newLength})
  //   }
  // }
  render () {
    console.log('state', this.state)

    return this.state.numActivities ?
      <ActivityList dash
        newComments={this.state.newComments}
        newBounces={this.state.newBounces}
        newProjects={this.state.newProjects}
        router={this.props.router}
        canGetMore={!this.state.loading && this.state.hasMore}
        getMore={()=>this.seeMore}
        nextPage={this.state.hasMore &&
          <SeeMore onClick={this.seeMore} loading={this.state.loading}/>}
      />
    :
    <EmptyPanel
      icon={<Tribe height={93} fill={"#D3D3D3"} />}
      headline={`It's a little quiet here...`}
      note={`Invite your friends to begin building your tribe`}
    />
  }
}

export default Relay.createContainer( Feed, {
  initialVariables: {
    theirHandle: '',
    userHandle: '',
    page: 1,
    num: 3,
    bouncesFilter: {},
    commentsFilter: {},
    projectsFilter: {},
  },
  prepareVariables: (urlParams) => {
    let page = parseInt((urlParams.page || 1), 10)
    return {
      ...urlParams,
      page,
      num: 3 * page,
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
          first: $num
          orderBy: createdAt_DESC
        ){
          count
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
          first: $num
          orderBy: createdAt_DESC
        ){
          count
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
          first: $num
          orderBy: createdAt_DESC
        ){
          count
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
