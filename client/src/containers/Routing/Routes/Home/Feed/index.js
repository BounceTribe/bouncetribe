import React, {Component} from 'react'
import Relay from 'react-relay'

import FeedContainer from 'reusables/FeedContainer'

class Feed extends Component {

  render() {
    return (

        <FeedContainer
          user={this.props.viewer.user}
        />

    )
  }
}


export default Relay.createContainer(
  Feed,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            name
            ${FeedContainer.getFragment('user')}
          }
        }
      `,
    },
  }
)
