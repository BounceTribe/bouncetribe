import Relay from 'react-relay';

export default class SigninUserMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {signinUser}`;
  }

  getFatQuery() {
    return Relay.QL`fragment on SigninPayload {
      token
      viewer
      user
    }`
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on SigninPayload {
              token
              viewer {
                user {
                  id
                  name
                  handle
                  profilePicUrl
                  profilePicThumb
                }
              }
            }
          `,
        ],
      },
    ]
  }

  getVariables() {
    return {
      auth0: {
        idToken: this.props.authToken,
      },
    }
  }
}
