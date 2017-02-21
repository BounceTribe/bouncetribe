import Relay, {Mutation} from 'react-relay'

export default class RemoveFromFriends extends Mutation {

  getVariables () {
    return {
      friends1UserId: this.props.selfId,
      friends2UserId: this.props.exfriendId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{removeFromFriends}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on RemoveFromFriendsPayload {
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
