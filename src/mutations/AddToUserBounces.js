import Relay, {Mutation} from 'react-relay'

export default class AddToUserBounces extends Mutation {

  getVariables () {
    return {
      bouncedByUserId: this.props.selfId,
      bouncedProjectsProjectId: this.props.projectId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{addToUserBounces}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddToUserBouncesPayload {
        user
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'bouncedByUser ',
      parentID: this.props.selfId,
      connectionName: 'bounces',
      edgeName: 'bouncedByUserEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }



}
