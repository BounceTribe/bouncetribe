import Relay, {Mutation} from 'react-relay'

export default class CreateFriendRequest extends Mutation {

  getVariables () {
    return {
      actorId: this.props.actorId,
      recipientId: this.props.recipientId,
    }
  }

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

}
