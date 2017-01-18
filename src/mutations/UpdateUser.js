import Relay from 'react-relay'

export default class UpdateUser extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user {
          id
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.userId,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.userId,
      name: this.props.name,
      portraitId: this.props.portraitId
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.userId,
      },
    }
  }

}
