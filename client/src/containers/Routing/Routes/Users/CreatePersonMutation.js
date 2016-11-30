import Relay from 'react-relay'
export default class CreatePersonMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{createPerson}`
  }

  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreatePersonPayload {
        newPersonEdge
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      connectionName: 'createPerson',
      edgeName: 'newPersonEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }


}
