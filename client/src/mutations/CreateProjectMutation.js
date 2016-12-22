import Relay from 'react-relay'

export default class CreateProjectMutation extends Relay.Mutation {

  // static fragments = {
  //   user: () => Relay.QL`
  //     fragment on User {
  //       id
  //     }
  //   `,
  // }

  getMutation () {
    return Relay.QL`mutation{createProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateProjectPayload {
        creator {
          id
          projects
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'creator',
      parentID: this.props.user.id,
      connectionName: 'projects',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      creatorId: this.props.user.id,
      description: this.props.project.description,
      privacy: this.props.project.privacy,
      title: this.props.project.title,
    }
  }

  // getOptimisticResponse () {
  //   return {
  //     edge: {
  //       node: {
  //         artist: {
  //           id: this.props.artist.id,
  //           name: this.props.artist.name,
  //           imageUrl: this.props.artist.imageUrl,
  //           spotifyId: this.props.artist.spotifyId
  //         }
  //       }
  //     },
  //   }
  // }

}
