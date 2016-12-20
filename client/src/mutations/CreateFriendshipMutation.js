import Relay from 'react-relay'

export default class CreateFriendshipMutation extends Relay.Mutation {

  // static fragments = {
  //   user: () => Relay.QL`
  //     fragment on User {
  //       id
  //     }
  //   `,
  // }

  getMutation () {
    return Relay.QL`mutation{createFriendship}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateFriendshipPayload {

      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.selfId,
      connectionName: 'friendships',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      usersId: [
        this.props.selfId,
        this.props.newFriendId
      ],
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
