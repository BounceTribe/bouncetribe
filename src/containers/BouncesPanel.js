import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectListSm} from 'components/ProjectListSm'
import Bounce from 'icons/Bounce'
import {EmptyPanel} from 'components/EmptyPanel'



class BouncesPanel extends Component {
  render () {
    //also check for dashboard component for display
    let {User} = this.props.viewer
    let hasBounces = !!User.bounces.length

    return (
      hasBounces ? <ProjectListSm {...this.props} /> :
      <EmptyPanel
        icon={<Bounce height={93} fill={"#D3D3D3"} />}
        headline={`Do you love someone’s project?`}
        note={`Bounce it to share with your tribe`}
      />
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
