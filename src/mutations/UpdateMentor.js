import Relay from 'react-relay'

export default class UpdateMentor extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateMentor}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateMentorPayload {
        mentor
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        mentor: this.props.mentorId,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.mentorId,
      handle: this.props.handle,
      createdAt: this.props.createdAt,
      summary: this.props.summary,
      videoUrl: this.props.videoUrl,
      mediaUrls: this.props.mediaUrls,
      occupation: this.props.occupation,
      mentees: this.props.mentees,
      menteeReservations: this.props.menteeReservations,
      qualifications: this.props.qualifications,
      specialties: this.props.specialties,
      website: this.props.website,
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
