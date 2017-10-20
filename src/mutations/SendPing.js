import Relay from 'react-relay'
import Moment from 'moment'
export default class SendPing extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user { id }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }]
  }

  getVariables () {
    let now = Moment();
    return {
      id: this.props.user.id,
      lastPing: now.toISOString(),
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.user.id,
      },
    }
  }

}
