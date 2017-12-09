import Relay, {Mutation} from 'react-relay'

export default class UpdateProject extends Mutation {

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

  getVariables () {
    console.log('proj mutate props', this.props);
    return {
      id: this.props.project.id,
      privacy: this.props.project.privacy,
      title: this.props.project.title,
      description: this.props.project.description,
      genresIds: this.props.genresIds,
      artworkId: this.props.artworkId
    }
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
