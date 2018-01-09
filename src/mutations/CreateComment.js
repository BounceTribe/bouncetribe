// import Relay from 'react-relay/classic'
//
// export default class CreateComment extends Relay.Mutation {
//
//   getVariables () {
//     return {
//       text: this.props.text,
//       timestamp: this.props.timestamp,
//       authorId: this.props.authorId,
//       projectId: this.props.projectId,
//       type: this.props.type,
//       parentId: this.props.parentId,
//       sessionId: this.props.sessionId
//     }
//   }
//   getMutation () {
//     return Relay.QL`mutation{createComment}`
//   }
//
//   getFatQuery () {
//     return Relay.QL`
//       fragment on CreateCommentPayload {
//         viewer
//       }
//     `
//   }
//   getConfigs () {
//     return [{
//       type: 'FIELDS_CHANGE',
//       fieldIDs: {
//         viewer: 'viewer-fixed'
//       }
//     }]
//   }
//
//
// }

import Relay from 'react-relay/classic'

export default class CreateComment extends Relay.Mutation {

  getVariables () {
    return {
      text: this.props.text,
      timestamp: this.props.timestamp,
      authorId: this.props.authorId,
      projectId: this.props.projectId,
      type: this.props.type,
      parentId: this.props.parentId,
    }
  }

  getMutation () {
    return Relay.QL`mutation{createComment}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateCommentPayload {
        project { comments },
        comment
      }
    `
  }
  getConfigs () {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'comment',
        parentID: this.props.parentId,
        connectionName: 'comments',
        edgeName: 'commentEdge',
        rangeBehaviors: {
          '': 'append',
          // Prepend the ship, wherever the connection is sorted by age
          'orderby(newest)': 'prepend',
        }
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on CreateCommentPayload {
              comment
            }
          `,
        ],
      },


  ]
  }


}
