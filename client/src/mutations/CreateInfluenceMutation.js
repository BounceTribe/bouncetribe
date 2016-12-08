import Relay from 'react-relay'

export default class CreateInfluenceMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }

  getMutation () {
    return Relay.QL`mutation{createInfluence}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateInfluencePayload {
        user {
          id
          influences
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'influences',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      artistId: this.props.artist.id,
      userId: this.props.user.id,
    }
  }

  getOptimisticResponse () {
    return {
      edge: {
        node: {
          artist: {
            id: this.props.artist.id,
            name: this.props.artist.name,
            imageUrl: this.props.artist.imageUrl,
            spotifyId: this.props.artist.spotifyId
          }
        }
      },
    }
  }

}
