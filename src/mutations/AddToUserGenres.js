import Relay, {Mutation} from 'react-relay'

export default class AddToUserGenres extends Mutation {

  getVariables () {
    return {
      genresGenreId: this.props.genreId,
      usersUserId: this.props.userId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{addToUserGenres}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddToUserGenresPayload {
        usersUser
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'usersUser',
      parentID: this.props.userId,
      connectionName: 'genres',
      edgeName: 'GenreEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }



}
