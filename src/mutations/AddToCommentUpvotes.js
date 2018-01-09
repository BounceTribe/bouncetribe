import Relay, {Mutation} from 'react-relay/classic'

export default class AddToCommentUpvotes extends Mutation {

  getVariables () {
    return {
      upvotesUserId: this.props.upvotesUserId,
      upvotesCommentId: this.props.upvotesCommentId,
    }
  }


  getMutation () {
    return Relay.QL`mutation{addToCommentUpvotes}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddToCommentUpvotesPayload {
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
