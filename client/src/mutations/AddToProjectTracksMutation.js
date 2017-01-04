import Relay from 'react-relay'

export default class AddToProjectTracks extends Relay.Mutation {

  // static fragments = {
  //   user: () => Relay.QL`
  //     fragment on User {
  //       id
  //     }
  //   `,
  // }

  getMutation () {
    return Relay.QL`mutation{addToProjectTracks}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddToProjectTracksPayload {
        trackProjectProject
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'trackProjectProject',
      parentID: this.props.trackProjectProjectId,
      connectionName: 'tracksProject',
      edgeName: 'trackProjectProjectEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      tracksFileId: this.props.tracksFileId,
      trackProjectProjectId: this.props.trackProjectProjectId,
    }
  }

  // getOptimisticResponse () {
  //   return {
  //     edge: {
  //       node: {
  //         artist: {
  //           id: this.props.artist.id,
  //           name: this.props.artist.name,
  //           imageUrl: this.props.artist.imageUrl,
  //           spotifyId: this.props.artist.spotifyId
  //         }
  //       }
  //     },
  //   }
  // }

}
