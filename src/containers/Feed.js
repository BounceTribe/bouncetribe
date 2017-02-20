import React, {Component} from 'react'
import Relay from 'react-relay'
import {FeedView} from 'styled'

class Feed extends Component {

  render () {
    return (
      <FeedView>
        <h1>Feed</h1>

      </FeedView>
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
