import Relay, {Mutation} from 'react-relay'

export default class CreateFriendRequest extends Mutation {

  getVariables () {
    console.log('CFQ Props1', this.props)
    return {
      actorId: this.props.actorId,
      recipientId: this.props.recipientId,
      accepted: this.props.accepted,
    }
  }

  getMutation () {
    console.log('CFQ Props2', this.props)

    return Relay.QL`mutation{createFriendRequest}`
  }

  getFatQuery () {
    console.log('CFQ Props3', this.props)

    return Relay.QL`
      fragment on CreateFriendRequestPayload {
        actor
      }
    `
  }
  getConfigs () {
    console.log('CFQ Props4', this.props)
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
