import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectListSm} from 'components/ProjectListSm'

class BouncesPanel extends Component {
  render () {
    return (
      <ProjectListSm {...this.props} />
    )
  }
}

export default Relay.createContainer(
  BouncesPanel, {
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
            bounces ( first:999 ) {
              edges {
                node {
                  id
                  project {
                    id
                    title
                    createdAt
                    artwork {url}
                    privacy
                    creator {handle}
                    bounces (first: 999) {
                      edges {
                        node {id}
                      }
                    }
                    comments (first: 999){
                      edges {
                        node { type }
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
