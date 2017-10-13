import Relay from 'react-relay'

export default class UpdateUser extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user
        portrait
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.userId,
        portrait: this.props.portraitId
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.userId,
      name: this.props.name,
      handle: this.props.handle,
      summary: this.props.summary,
      website: this.props.website,
      isOnline: this.props.isOnline,
      portraitId: this.props.portraitId,
      facebookId: this.props.facebookId,
      placename: this.props.placename,
      genresIds: this.props.genresIds,
      skillsIds: this.props.skillsIds,
      artistInfluencesIds: this.props.artistInfluencesIds,
      experience: this.props.experience,
      doNotEmail: this.props.doNotEmail
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.userId,
      },
    }
  }

}
