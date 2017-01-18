import React, {Component} from 'react'
import Relay from 'react-relay'

class Feed extends Component {
  render () {
    return (
      <div>
        <h1>Feed</h1>
      </div>
    )
  }
}

export default Relay.createContainer(
  Feed, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
        }
      `,
    },
  }
)
