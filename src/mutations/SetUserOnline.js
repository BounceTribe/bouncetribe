import Relay from 'react-relay'

export default class SetUserOnline extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }]
  }

  getVariables () {
    console.log('props isonline', this.props);
    let isOnline = true;
    return {
      id: this.props.user.id,
      isOnline
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.user.id,
      },
    }
  }

}
