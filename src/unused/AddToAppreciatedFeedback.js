import Relay, {Mutation} from 'react-relay'

export default class AddToAppreciatedFeedback extends Mutation {

  getVariables () {
    return {
      appreciatedFeedbackUserId: this.props.appreciatedFeedbackUserId,
      appreciatedFeedbackSessionId: this.props.appreciatedFeedbackSessionId
    }
  }

  getMutation () {
    return Relay.QL`mutation{addToAppreciatedFeedback}`
  }
  

  getFatQuery () {
    return Relay.QL`
      fragment on AddToAppreciatedFeedbackPayload {
        appreciatedFeedbackSession
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        appreciatedFeedbackSession: this.props.appreciatedFeedbackSessionId,
      },
    }]
  }





}
