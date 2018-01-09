import Relay, {Mutation} from 'react-relay/classic'

export default class CreateMessage extends Mutation {

  getVariables () {
    return {
      text: this.props.text,
      recipientId: this.props.recipientId,
      senderId: this.props.senderId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{createMessage}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateMessagePayload {
        sender { sentMessages }
        message
      }
    `
  }
  getConfigs () {
    return [
      {
        type: 'RANGE_ADD',
        parentID: this.props.senderId,
        connectionName: 'messages',
        edgeName: 'messageEdge',
        rangeBehaviors: {
          '': 'append',
          'orderby(newest)': 'prepend',
        }
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on CreateMessagePayload {
              message {
                id
                text
                createdAt
                sender {id, handle}
                recipient {id, handle}
              }
            }
          `,
        ],
      },


  ]
  }


}
