import Relay, {Mutation} from 'react-relay'

export default class UpdateProject extends Mutation {

  getVariables () {
    return {
      id: this.props.project.id,
      privacy: this.props.project.privacy,
      title: this.props.project.title,
      description: this.props.project.description,
      genresIds: this.props.genresIds
    }
  }

  getMutation () {
    return Relay.QL`mutation{updateProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateProjectPayload {
        project
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project.id,
      },
    }]
  }





}
