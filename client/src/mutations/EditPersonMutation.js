import Relay from 'react-relay'

export default class EditPersonMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        email
        name
        handle
        id
      }
    `,
  }

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user {
          id
          handle
          email
          name
          summary
        }
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
    return {
      id: this.props.user.id,
      handle: this.props.handle,
      name: this.props.name,
      email: this.props.email,
      summary: this.props.summary
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.user.id,
        handle: this.props.handle,
        name: this.props.name,
        email: this.props.email,
        summary: this.props.summary
      },
    }
  }

}
