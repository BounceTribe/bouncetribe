import Relay, {Mutation} from 'react-relay'

export default class CreateSession extends Mutation {

  getVariables () {
    return {
      projectsIds: this.props.projectsIds
    }
  }

  getMutation () {
    return Relay.QL`mutation{createSession}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateSessionPayload {
        viewer
        session
      }
    `
  }
  getConfigs () {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: 'viewer-fixed'
        }
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on CreateSessionPayload {
              session
            }
          `,
        ],
      }
    ]
  }


}
