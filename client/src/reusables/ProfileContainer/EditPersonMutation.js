import Relay from 'react-relay'

class EditPersonMutation extends Relay.Mutation {

  static fragments = {
    person: () => Relay.QL`
      fragment on Person {
        personID
      }
    `,

  };

  getMutation() {
    return Relay.QL`mutation {editPerson}`
  }

  getVariables() {
    return {
      personID: this.props.person.personID,
      handle: this.props.handle
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditPersonPayload {
        person {
          personID
          email
          name
          handle
        }
        viewer {
          self
        }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
          person: this.props.person.personID,
      }
    }]
  }

  // getOptimisticResponse() {
  //     return {
  //         person: {
  //             personID: this.props.personID,
  //             handle: this.props.handle
  //         }
  //     }
  // }

}

export default EditPersonMutation
