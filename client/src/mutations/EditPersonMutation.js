import Relay from 'react-relay'
import {handleSanitizer} from 'utils/validators'

export default class EditPersonMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        email
        name
        handle
        placename
        summary
        id
        website
        experience
        longitude
        latitude
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
          longitude
          latitude
          placename
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
      placename: this.props.placename,
      website: this.props.website,
      experience: this.props.experience,
      longitude: this.props.longitude,
      latitude: this.props.latitude
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
        website: this.props.website,
        experience: this.props.experience,
        longitude: this.props.longitude,
        latitude: this.props.latitude,
        placename: this.props.placename,
      },
    }
  }

}
