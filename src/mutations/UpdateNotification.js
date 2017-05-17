import Relay, {Mutation} from 'react-relay'

export default class UpdateNotification extends Mutation {

  getVariables () {
    return {
      id: this.props.id,
      checked: this.props.checked
    }
  }

  getMutation () {
    return Relay.QL`mutation{updateNotification}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateNotificationPayload {
        notification
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        notification: this.props.id,
      },
    }]
  }





}
