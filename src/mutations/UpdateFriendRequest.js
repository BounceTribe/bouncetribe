import Relay, {Mutation} from 'react-relay'

export default class UpdateFriendRequest extends Mutation {

  getVariables () {
    return {
      id: this.props.id,
      accepted: this.props.accepted,
      ignored: this.props.ignored
    }
  }

  getMutation () {
    return Relay.QL`mutation{updateFriendRequest}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateFriendRequestPayload {
        friendRequest
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        friendRequest: this.props.id,
      },
    }]
  }





}
