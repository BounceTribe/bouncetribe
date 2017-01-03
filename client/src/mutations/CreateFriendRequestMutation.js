import Relay from 'react-relay'

export default class CreateFriendRequestMutation extends Relay.Mutation {

  // static fragments = {
  //   user: () => Relay.QL`
  //     fragment on User {
  //       id
  //     }
  //   `,
  // }

  getMutation () {
    return Relay.QL`mutation{createFriendRequest}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateFriendRequestPayload {
        actor
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'actor',
      parentID: this.props.actorId,
      connectionName: 'invitations',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      actorId: this.props.actorId,
      recipientId: this.props.recipientId,
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
