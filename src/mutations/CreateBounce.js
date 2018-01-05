import Relay from 'react-relay'

export default class CreateBounce extends Relay.Mutation {

  getVariables () {
    return {
      bouncerId: this.props.bouncerId,
      projectId: this.props.projectId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{createBounce}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateBouncePayload {
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
