import Relay from 'react-relay'

export default class CreateComment extends Relay.Mutation {

  getVariables () {
    return {
      text: this.props.text,
      timestamp: this.props.timestamp,
      authorId: this.props.authorId,
      projectId: this.props.project.id,
      type: this.props.type
    }
  }

  getMutation () {
    return Relay.QL`mutation{createComment}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateCommentPayload {
        project {
          comments
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project.id
      }
    }]
  }


}
