import Relay from 'react-relay'

export default class CreateMentorMutation extends Relay.Mutation {

  getVariables () {
    return {
      email: this.props.user.email,
      handle: this.props.user.handle,
      userAccountId: this.props.user.id,
    }
  }

  getMutation () {
    return Relay.QL`mutation{createMentor}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateMentorPayload {
        mentor
        viewer
      }
    `
  }

  getConfigs () {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        connectionName: 'allMentors',
        edgeName: 'mentor',
        rangeBehaviors: {
          '': 'append',
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on CreateMentorPayload {
              mentor
            }
          `,
        ],
      },
    ]
  }
}
