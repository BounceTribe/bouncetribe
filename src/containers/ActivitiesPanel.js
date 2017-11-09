import React, {Component} from 'react'
import Relay from 'react-relay'
import {Activity, ActivitiesContainer} from 'styled/ActivitiesList'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {purple} from 'theme'

class ActiviesPanel extends Component {

  get activities () {
    // let list = []
    let {User} = this.props.viewer
    let {comments, bounces, projects} = User
    console.log('User', User)
    let list = comments.edges.map(edge =>
      <Activity
        key={edge.node.id}
        date={edge.node.createdAt}
        icon={<Tribe height={13}/>}
        text={`Gave Feedback to ${(edge.node.project || {}).title}`} />
    )
    list = list.concat(bounces.edges.map(edge =>
      <Activity
        key={edge.node.id}
        date={edge.node.createdAt}
        icon={<Bounce width={19} fill={purple}/>}
        text={`Bounced ${edge.node.project.title}`} />
    ))
    list = list.concat(projects.edges.map(edge =>
      <Activity
        key={edge.node.id}
        date={edge.node.createdAt}
        icon={<Music height={13}/>}
        text={`Added a new Project - ${edge.node.title}`} />
    ))
    list = list.sort( (a,b) => (b.props.date - a.props.date) )
    console.log('list', list);
    return list
  }

  render () {
    return (
      <div>
        {this.activities}
      </div>
    )
  }
}

export default Relay.createContainer( ActiviesPanel, {
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
          ){
            edges {
              node {
                id
                createdAt
                project {
                  id
                  title
                  privacy
                }
              }
            }
          }
          bounces (
            first:999
            orderBy: createdAt_ASC
           ) {
            edges {
              node {
                id
                createdAt
                project {
                  id
                  title
                  privacy
                }
              }
            }
          }
          projects (
            first: 999
            orderBy: createdAt_ASC
          ){
            edges {
              node {
                id
                title
                createdAt
                privacy
              }
            }
          }
        }
      }
    `,
  }
}
)
