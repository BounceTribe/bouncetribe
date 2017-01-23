import Relay from 'react-relay'

export default class CreateProjectMutation extends Relay.Mutation {

  getVariables () {
    let {
      description,
      genre,
      privacy,
      title,
      artworkId,
      tracksIds
    } = this.props.project
    return {
      creatorId: this.props.user.id,
      description,
      genre,
      new: this.props.project.new,
      privacy,
      title,
      artworkId,
      tracksIds
    }
  }

  getMutation () {
    return Relay.QL`mutation{createProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateProjectPayload {
        creator {
          id
          projects
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'creator',
      parentID: this.props.user.id,
      connectionName: 'projects',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }


}
