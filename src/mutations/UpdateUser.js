import Relay, {Mutation} from 'react-relay'

export default class UpdateUser extends Mutation {

  getMutation () {
    return Relay.QL`mutation{updateUser}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user
        portrait
        # viewer
      }
    `
  }

  getVariables () {
    console.log('user update props', this.props);
    return {
      id: this.props.userId,
      name: this.props.name,
      handle: this.props.handle,
      summary: this.props.summary,
      website: this.props.website,
      lastPing: this.props.lastPing,
      portraitId: this.props.portraitId,
      facebookId: this.props.facebookId,
      placename: this.props.placename,
      genresIds: this.props.genresIds,
      skillsIds: this.props.skillsIds,
      artistInfluencesIds: this.props.artistInfluencesIds,
      experience: this.props.experience,
      doNotEmail: this.props.doNotEmail,
      deactivated: this.props.deactivated,
      doNotEmailTR: this.props.doNotEmailTR,
      doNotEmailTA: this.props.doNotEmailTA,
      doNotEmailPF: this.props.doNotEmailPF,
      doNotEmailPB: this.props.doNotEmailPB,
    }
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: 'viewer-fixed'
      }
    }]
    // return [{
    //   type: 'FIELDS_CHANGE',
    //   fieldIDs: {
    //     user: this.props.userId,
    //     portrait: this.props.portraitId
    //   },
    // }]
  }


  getOptimisticResponse () {
    return {
      user: {
        id: this.props.userId,
      },
    }
  }

}
