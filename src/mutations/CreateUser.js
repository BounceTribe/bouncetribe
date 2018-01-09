import Relay from 'react-relay/classic'

export default class CreateUserMutation extends Relay.Mutation {

  getVariables () {
    return {
      email: this.props.email,
      handle: this.props.handle,
      authProvider: {
        auth0: {
          idToken: this.props.idToken
        }
      },
    }
  }

  getMutation () {
    return Relay.QL`mutation{createUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateUserPayload {
        user
        viewer
      }
    `
  }

  getConfigs () {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        connectionName: 'allUsers',
        edgeName: 'user',
        rangeBehaviors: {
          '': 'append',
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on CreateUserPayload {
              user
            }
          `,
        ],
      },
    ]
  }
}
