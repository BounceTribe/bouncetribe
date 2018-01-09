import Relay from 'react-relay/classic'

export default class DeleteProject extends Relay.Mutation {

  getVariables () {
    return {
      id: this.props.id
    }
  }

  getMutation () {
    return Relay.QL`mutation{deleteProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteProjectPayload {
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
