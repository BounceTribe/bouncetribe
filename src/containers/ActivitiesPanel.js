import React, {Component} from 'react'
import Relay from 'react-relay'
import Music from 'icons/Music'
import {EmptyPanel} from 'components/EmptyPanel'
import {ActivityList} from 'components/ActivityList'
import {mapNodes, mapIds} from 'utils/mapNodes'
import {SeeMore} from 'styled'


class ActiviesPanel extends Component {

  constructor(props) {
    super(props)
    console.log('num visible', this.props.viewer.User.projects.edges.length);
    // if (!props.relay.variables.aVARIABLE) {
      // props.relay.setVariables({aVARIABLE: props.viewer.user.handle})
    //   // props.relay.forceFetch()
    // }
    console.log('const props actpan', props);
    let {user} = this.props.viewer
    this.state = Object.assign(
      this.mapActivity(this.props), {
        loading: false,
        friendIds: mapIds(user.friends).concat(user.id),
        listLength: 0
      }
    )
  }

  componentWillMount() {
    console.log('ACTPanel', this.props)
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
    let {User} = props.viewer
    let comments = mapNodes(User.comments)
    let bounces  = mapNodes(User.bounces)
    let projects = mapNodes(User.projects)
    let numActivities = comments.length + bounces.length + projects.length
    let totalActivities = User.comments.count + User.bounces.count + User.projects.count
    return {
      comments,
      bounces,
      projects,
      numActivities,
      totalActivities,
      hasMore: totalActivities > numActivities
    }
  }

  setPage = (props, newPage) => {
    let {page, theirHandle} = props.params
    if (!newPage) newPage = parseInt((page || 1), 10) + 1
    let newPath = `/${theirHandle}/activity/${newPage}/`
    this.props.router.replace(newPath)
  }

   seeMore = () => {
     !this.state.loading && this.setState({loading: true})
     this.setPage(this.props)
   }
  render () {
    let {user, User} = this.props.viewer
    let isSelf = user.id===User.id
    // let totalActivities = mapNodes(comments).filter(comment=>comment.project).length + bounces.count + projects.count
    return (
      <div>
      {this.props.children}
      {this.state.numActivities ?
        <ActivityList
          {...this.state}
          router={this.props.router}
          getMore={this.seeMore}
          // listLength={(newLength)=>this.state.hasMore && this.compareListLength(newLength)}
          nextPage={this.state.hasMore &&
            <SeeMore onClick={this.seeMore} loading={this.state.loading}/>}
        />
      :
      <EmptyPanel
        icon={<Music height={113} fill={"#D3D3D3"} />}
        headline={isSelf ? `Everyone wants to hear it` : `No Activity Yet`}
        note={isSelf ? `Upload your first project!` : ``}
        btnLabel={isSelf ? `New Project` : ``}
        btnClick={()=>this.props.router.push(`/projects/${user.handle}/new/`)}
      />}</div>
    )
  }
}


export default Relay.createContainer( ActiviesPanel, {
  initialVariables: {
    theirHandle: '',
    userHandle: '',
    page: 1,
    num: 3,
    // aVARIABLE: '',
    bouncesFilter: {},
    commentsFilter: {},
    projectsFilter: {}
  },
  prepareVariables: (urlParams, b) => {
    console.log({urlParams, b});
    return {
      ...urlParams,
      page: parseInt((urlParams.page || 1), 10),
      num: 3 * parseInt((urlParams.page || 1), 10),
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
      // projectsFilter: {
      //   privacy: 'TRIBE',
      //   creator: {
      //     friends_some: { handle: urlParams.aVARIABLE },
      //     deactivated: false
      //   },
      // }
      // use similiar filters for comments, bounces (if project changes privacy)
      projectsFilter: { OR:
        [ {
          privacy_not: 'PRIVATE',
          creator: { deactivated: false }
        }, {
          privacy: 'TRIBE',
          creator: {
            friends_some: { handle: urlParams.userHandle },
            deactivated: false
          },
        }
      ] }
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
        # @include(if: $restaurantExists)
        User (handle: $theirHandle) {
          id
          handle
          deactivated
          comments (
            first: $num
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
            first: $num
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
            first: $num
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
