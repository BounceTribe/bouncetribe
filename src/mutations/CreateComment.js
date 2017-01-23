import Relay from 'react-relay'

export default class CreateComment extends Relay.Mutation {

  getVariables () {
    return {
      text: this.props.text,
      timestamp: this.props.timestamp,
      authorId: this.props.self.id,
      projectId: this.props.project.id
    }
  }

  getMutation () {
    return Relay.QL`mutation{createComment}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateCommentPayload {
        project {
          comments
        }
        edge
      }
    `
  }
  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.project.id,
      connectionName: 'comments',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getOptimisticResponse() {
    return {
      project: {
        id: this.props.project.id
      },
      edge: {
        node: {
          text: this.props.text,
          timestamp: this.props.timestamp,
        }
      }
    }
  }

}
