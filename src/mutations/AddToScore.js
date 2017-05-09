import Relay from 'react-relay'

export default class AddToScore extends Relay.Mutation {

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
    let score = this.props.user.score + this.props.plus
    return {
      id: this.props.user.id,
      score
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
