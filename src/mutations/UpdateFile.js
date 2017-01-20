import Relay from 'react-relay'

export default class UpdateFileMutation extends Relay.Mutation {


  getMutation () {
    return Relay.QL`mutation{updateFile}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateFilePayload {
        file
        uploader
      }
    `
  }
  getConfigs () {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          file: this.props.fileId,
        },
      },
    ]
  }

  getVariables () {
    return {
      id: this.props.fileId,
      visualization: this.props.visualization,
      uploaderId: this.props.self.id
    }
  }

}
