import Relay from 'react-relay/classic'

export default class DeleteComment extends Relay.Mutation {

  getVariables () {
    return {
      id: this.props.id
    }
  }

  getMutation () {
    return Relay.QL`mutation{deleteComment}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteCommentPayload {
        project
        viewer
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: 'viewer-fixed',
      }
    }]
  }


}
