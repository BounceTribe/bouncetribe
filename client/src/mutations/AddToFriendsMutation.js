import Relay from 'react-relay'

export default class AddToFriendsMutation extends Relay.Mutation {

  // static fragments = {
  //   user: () => Relay.QL`
  //     fragment on User {
  //       id
  //     }
  //   `,
  // }

  getMutation () {
    return Relay.QL`mutation{addToFriends}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddToFriendsPayload {
        friends1User
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'friends1User',
      parentID: this.props.selfId,
      connectionName: 'friends',
      edgeName: 'friends1UserEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      friends1UserId: this.props.selfId,
      friends2UserId: this.props.newFriendId,
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
