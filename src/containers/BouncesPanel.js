import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectListSm} from 'components/ProjectListSm'
import Bounce from 'icons/Bounce'
import {EmptyPanel} from 'components/EmptyPanel'



class BouncesPanel extends Component {
  render () {
    //also check for dashboard component for display
    let {User, user} = this.props.viewer
    let isSelf = user.id===User.id

    let hasBounces = !!User.bounces.length
    let isDash = this.props.route.path.substr(0,6)==='/dash/'

    return (
      (hasBounces || isDash) ?
      <ProjectListSm {...this.props} />
      :
      <EmptyPanel
        icon={<Bounce width={100} fill={"#D3D3D3"} />}
        headline={isSelf ? `Do you love someone’s project?` : `User has no bounces yet`}
        note={isSelf ? `Bounce it to share with your tribe` : ``}
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
