import Relay from 'react-relay'

export default class UpdateProjectMutation extends Relay.Mutation {
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
    return Relay.QL`mutation{updateProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateProjectPayload {
        project
        creator
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        creator: this.props.user.id,
        project: this.props.project.id
      },
    }]
  }

  getVariables () {
    return {
      title: this.props.title,
      description: this.props.description,
      id: this.props.project.id,
      privacy: this.props.privacy
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
