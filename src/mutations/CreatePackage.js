import Relay from 'react-relay'

export default class CreatePackageMutation extends Relay.Mutation {

  getVariables () {
    return {
      mentorId: this.props.mentorId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{createPackage}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreatePackagePayload {
        package
        viewer
      }
    `
  }

  getConfigs () {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        connectionName: 'allPackages',
        edgeName: 'package',
        rangeBehaviors: {
          '': 'append',
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on CreatePackagePayload {
              package
            }
          `,
        ],
      },
    ]
  }
}
