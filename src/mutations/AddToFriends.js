import Relay, {Mutation} from 'react-relay/classic'

export default class AddToFriends extends Mutation {
  getVariables () {
    return {
      friends1UserId: this.props.selfId,
      friends2UserId: this.props.newFriendId,
    }
  }
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
}
