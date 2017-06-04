import Relay, {Mutation} from 'react-relay'

export default class UpdateProject extends Mutation {

  getVariables () {
    return {
      id: this.props.project.id,
      privacy: this.props.project.privacy,
      title: this.props.project.title,
      description: this.props.project.description,
      genresIds: this.props.genresIds,
      artworkId: this.props.artworkId
    }
  }

  getMutation () {
    return Relay.QL`mutation{updateProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateProjectPayload {
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
