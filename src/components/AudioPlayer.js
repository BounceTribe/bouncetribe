import React, {Component} from 'react'
import Relay from 'react-relay'

class AudioPlayer extends Component {

  render () {
    console.log(this.props)
    return (
      <div>
        <h2>AudioPlayer</h2>
      </div>
    )
  }
}

export default Relay.createContainer(
  AudioPlayer, {
    initialVariables: {
      trackId: ''
    },
    fragments: {
      track: () => Relay.QL`
        fragment on Viewer {
          File(id: $trackId) {
            url
          }
        }
      `,
    },
  }
)
