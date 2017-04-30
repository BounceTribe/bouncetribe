import React, {Component} from 'react'
import Relay from 'react-relay'

class Session extends Component {


  render() {
    return (
      <div>
        hello
      </div>
    )
  }
}


export default Relay.createContainer(
  Session, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
        }
      `
    }
  }
)
