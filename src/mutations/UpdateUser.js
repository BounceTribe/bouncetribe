import Relay from 'react-relay'

export default class UpdateUser extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user
        portrait
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.userId,
        portrait: this.props.portraitId
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.userId,
      name: this.props.name,
      portraitId: this.props.portraitId,
      facebookId: this.props.facebookId,
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.userId,
        portrait: {
          id: this.props.portraitId
        }
      },
    }
  }

}
