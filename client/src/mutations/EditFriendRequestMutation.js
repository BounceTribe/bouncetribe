import Relay from 'react-relay'

export default class EditFriendRequestMutation extends Relay.Mutation {
  // static fragments = {
  //   user: () => Relay.QL`
  //     fragment on User {
  //       email
  //       name
  //       handle
  //       placename
  //       summary
  //       id
  //       website
  //       experience
  //       longitude
  //       latitude
  //     }
  //   `,
  // }

  getMutation () {
    return Relay.QL`mutation{updateFriendRequest}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateFriendRequestPayload {
        friendRequest
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        friendRequest: this.props.id,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.id,
      accepted: this.props.accepted,
      ignored: this.props.ignored
    }
  }

  // getOptimisticResponse () {
  //   return {
  //     user: {
  //       id: this.props.user.id,
  //       handle: this.props.handle,
  //       name: this.props.name,
  //       email: this.props.email,
  //       summary: this.props.summary,
  //       website: this.props.website,
  //       experience: this.props.experience,
  //       longitude: this.props.longitude,
  //       latitude: this.props.latitude,
  //       placename: this.props.placename,
  //     },
  //   }
  // }

}
