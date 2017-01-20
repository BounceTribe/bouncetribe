import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import AudioUploader from 'components/AudioUploader'
import AudioPlayer from 'components/AudioPlayer'


class ProjectNew extends Component {

  state = {
    trackId: false
  }

  fileSuccess = (fileId) => {
    this.setState((prevState, props)=>{
      return {
        trackId: fileId
      }
    })
  }

  get audioComponent () {
    if (this.state.trackId) {
      return (
        <AudioPlayer
          trackId={this.state.trackId}
        />
      )
    } else {
      return (
        <AudioUploader
          fileSuccess={this.fileSuccess}
          self={this.props.viewer.user}
        />
      )
    }
  }

  render () {
    return (
      <View>
        {this.audioComponent}

      </View>
    )
  }
}

export default Relay.createContainer(
  ProjectNew, {
    initialVariables: {
      trackId: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            ${AudioUploader.getFragment('self')}
          }
        }
      `,
    }
  }
)
