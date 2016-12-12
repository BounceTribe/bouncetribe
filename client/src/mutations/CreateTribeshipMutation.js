import Relay from 'react-relay'

export default class CreateInfluenceMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation () {
    return Relay.QL`mutation{createTribeship}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateTribeshipPayload {
        party1
        party2
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'party1',
      parentID: this.props.user.id,
      connectionName: 'tribeship',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      party1Id: this.props.user.id,
      party2Id: this.props.otherId,
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
