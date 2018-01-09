import Relay from 'react-relay/classic'

export default class UpdatePackage extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updatePackage}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdatePackagePayload {
        package
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        package: this.props.id,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.id,
      responseHours: this.props.responseHours,
      reviewsPerMonth: this.props.reviewsPerMonth,
      videoChatsPerMonth: this.props.videoChatsPerMonth,
      careerStrategizing: this.props.careerStrategizing,
      mixingMasteringHelp: this.props.mixingMasteringHelp,
      introductionsToNetwork: this.props.introductionsToNetwork,
      monthlyRate: this.props.monthlyRate,
    }
  }
  getOptimisticResponse () {
    return {
      package: {
        id: this.props.id,
      },
    }
  }

}
