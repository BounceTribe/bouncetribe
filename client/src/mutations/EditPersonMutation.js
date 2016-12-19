import Relay from 'react-relay'
import {handleSanitizer} from 'utils/validators'

export default class EditPersonMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        email
        name
        handle
        location
        summary
        id
        website
        experience
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
          location
          website
          experience
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
      handle: handleSanitizer(this.props.handle),
      name: this.props.name,
      email: this.props.email,
      summary: this.props.summary,
      location: this.props.location,
      website: this.props.website,
      experience: this.props.experience

    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.user.id,
        handle: this.props.handle,
        name: this.props.name,
        email: this.props.email,
        summary: this.props.summary,
        location: this.props.location,
        website: this.props.website,
        experience: this.props.experience
      },
    }
  }

}
