import Relay from 'react-relay'

export default class DeleteInfluenceMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation () {
    return Relay.QL`mutation{deleteInfluence}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteInfluencePayload {
        user {
          id
          influences
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'influences',
      deletedIDFieldName: 'deletedId'
    }]
  }

  getVariables () {
    return {
      id: this.props.influenceId,
    }
  }

  getOptimisticResponse () {
    return {
      deletedId: this.props.influenceId
    }
  }

}
