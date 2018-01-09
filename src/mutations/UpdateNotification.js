import Relay, {Mutation} from 'react-relay/classic'

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
        viewer
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: 'viewer-fixed'
      }
    }]
  }





}
