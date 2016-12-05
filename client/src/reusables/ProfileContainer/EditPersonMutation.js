import Relay from 'react-relay'

class EditPersonMutation extends Relay.Mutation {

  static fragments = {
    person: () => Relay.QL`
      fragment on Person {
        personID,
        email,
        name,
        handle,
        profilePicUrl,
      }
    `,
  }

  getMutation() {
    return Relay.QL`
      mutation RootMutation {
        editPerson
      }
    `
  }

  getVariables() {
    return {
      personID: this.props.person.personID,
      handle: this.props.handle,
      person: this.props.person
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditPersonPayload {
        person {
          personID,
          handle,
          email,
          name
        },
      }
    `
  }

  getConfigs() {
    // return [{
    //   type: 'REQUIRED_CHILDREN',
    //   children: [Relay.QL`
    //     fragment on EditPersonPayload {
    //       person {
    //         personID
    //         email
    //         name
    //         handle
    //         profilePicUrl
    //       }
    //     }
    //   `]
    // }]
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
          person: this.props.person.personID,
      }
    }]
  }

  getOptimisticResponse() {
      return {
          person: {
              personID: this.props.person.personID,
              handle: this.props.handle
          }
      }
  }

}

export default EditPersonMutation
