import Relay, {Mutation} from 'react-relay'

export default class CreateMessage extends Mutation {

  getVariables () {
    return {
      text: this.props.text,
      recipientId: this.props.recipientId,
      senderId: this.props.senderId,
      sessionParentId: this.props.sessionParentId
    }
  }

  getMutation () {
    return Relay.QL`mutation{createMessage}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateMessagePayload {
        sessionParent
      }
    `
  }
  getConfigs () {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          sessionParent: this.props.senderParentId
        }
      }
    ]
  }


}
