import Relay from 'react-relay'

class EditPersonMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation {editPerson}`
  }

  getVariables() {
    return {
      personID: this.props.personID,
      handle: this.props.handle
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditPersonPayload {
        viewer {
          self {
            personID
            email
            name
            handle
            profilePicUrl
            influences
          }
        }
        person
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
          viewer: this.props.viewer.self.personID,
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
