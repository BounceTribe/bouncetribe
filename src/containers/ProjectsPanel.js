import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectListSm} from 'components/ProjectListSm'

class ProjectsPanel extends Component {
  render () {
    console.log('projs this', this)
    return (
      <ProjectListSm {...this.props} />
    )
  }
}

export default Relay.createContainer(
  ProjectsPanel, {
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
              first: 999
              orderBy: createdAt_ASC
            ){
              edges {
                node {
                  id
                  title
                  createdAt
                  bounces (first:999) {
                    edges {
                      node {id}
                    }
                  }
                  artwork { url }
                  privacy
                  creator {handle}
                  comments ( first: 999 ) {
                    edges {
                      node {
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
