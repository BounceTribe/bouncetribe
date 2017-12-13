import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectListSm} from 'components/ProjectListSm'
import Bounce from 'icons/Bounce'
import {EmptyPanel} from 'components/EmptyPanel'



class BouncesPanel extends Component {
  render () {
    let {User, user} = this.props.viewer
    let isSelf = user.id===User.id
    let hasBounces = !!User.bounces.count
    console.log('bp', this);
    return (
      hasBounces ? <ProjectListSm {...this.props} />
      :
      <EmptyPanel
        icon={<Bounce width={100} fill={"#D3D3D3"} />}
        headline={isSelf ? `Do you love someone’s project?` : `${User.handle} hasn't bounced any tracks yet`}
        note={isSelf ? `Bounce it to share with your tribe` : ``}
      />
    )
  }
}

export default Relay.createContainer(
  BouncesPanel, {
    initialVariables: { theirHandle: '' , bouncesFilter: {}},
    prepareVariables: (urlParams) => {
      return {
        ...urlParams,
        //ensures non-deleted projects as well
        bouncesFilter: {
          project: {privacy_not: 'PRIVATE'},
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
          User (handle: $theirHandle) {
            id
            handle
            bounces (
              first:999
              filter: $bouncesFilter
             ) {
              count
              edges {
                node {
                  id
                  project {
                    id
                    title
                    createdAt
                    artwork {url}
                    artworkSmall {url}
                    privacy
                    creator {handle}
                    bounces (first: 999) {
                      edges { node {id} }
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
