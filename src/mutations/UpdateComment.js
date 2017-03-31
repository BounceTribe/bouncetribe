import Relay, {Mutation} from 'react-relay'

export default class UpdateComment extends Mutation {

  getVariables () {
    return {
      id: this.props.id,
      text: this.props.text
    }
  }

  getMutation () {
    return Relay.QL`mutation{updateComment}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateCommentPayload {
        comment
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        comment: this.props.id,
      },
    }]
  }





}
