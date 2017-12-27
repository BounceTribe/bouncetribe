import Relay, {Mutation} from 'react-relay'

export default class AddToReservations extends Mutation {
  getVariables () {
    return {
      mentorReservationsMentorId: this.props.mentorId,
      menteeReservationsUserId: this.props.menteeId,
    }
  }
  getMutation () {
    return Relay.QL`mutation{addToMentorOnUser2}`
  }
  getFatQuery () {
    return Relay.QL`
      fragment on AddToMentorOnUser2Payload {
        mentorReservationsMentor
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'mentorReservationsMentor',
      parentID: this.props.mentorId,
      connectionName: 'mentor',
      edgeName: 'mentorReservationsMentorEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }
}

// addToMentorOnUser2(mentorReservationsMentorId: ID!, menteeReservationsUserId: ID!): AddToMentorOnUser2Payload
//
// removeFromMentorOnUser2(mentorReservationsMentorId: ID!, menteeReservationsUserId: ID!): RemoveFromMentorOnUser2Payload
