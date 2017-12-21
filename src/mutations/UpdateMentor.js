import Relay from 'react-relay'

export default class UpdateMentor extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateMentor}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateMentorPayload {
        mentor
        portrait
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        mentor: this.props.mentorId,
        portrait: this.props.portraitId
      },
    }]
  }

  getVariables () {
    console.log('up[datementor props', this.props);
    return {
      id: this.props.mentorId,
      handle: this.props.handle,
      email: this.props.email,
      createdAt: this.props.createdAt,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      placename: this.props.placename,
      summary: this.props.summary,
      videoUrl: this.props.videoUrl,
      occupation: this.props.occupation,
      qualifications: this.props.qualifications,
      specialties: this.props.specialties,
      website: this.props.website,
      portraitId: this.props.portraitId || this.props.portrait.id,
      portraitSmallId: this.props.portraitSmallId || this.props.portraitSmall.id,
      portraitMiniId: this.props.portraitMiniId || this.props.portraitMini.id,
      genresIds: this.props.genresIds,
      artistInfluencesIds: this.props.artistInfluencesIds,
      deactivated: this.props.deactivated,
    }
  }
  getOptimisticResponse () {
    return {
      mentor: {
        id: this.props.mentorId,
      },
    }
  }

}
