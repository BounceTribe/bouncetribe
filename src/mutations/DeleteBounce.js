import Relay from 'react-relay'

export default class DeleteBounce extends Relay.Mutation {

  getVariables () {
    return {
      id: this.props.id
    }
  }

  getMutation () {
    return Relay.QL`mutation{deleteBounce}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteBouncePayload {
        project
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
