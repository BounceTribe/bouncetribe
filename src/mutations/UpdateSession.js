import Relay, {Mutation} from 'react-relay'

export default class UpdateSession extends Mutation {

  getVariables () {
    return {
      id: this.props.id,
      feedback: this.props.feedback
    }
  }

  getMutation () {
    return Relay.QL`mutation{updateSession}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateSessionPayload {
        session
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        session: this.props.id,
      },
    }]
  }





}
