import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import AudioUploader from 'components/AudioUploader'


class ProjectNew extends Component {

  fileSuccess = (fileId) => {
    let {
      push,
      location
    } = this.props.router
    push(`${location.pathname}/${fileId}`)
  }

  get uploader () {
    let {params} = this.props.router
    if (!params.trackId) {
      return (
        <AudioUploader
          fileSuccess={this.fileSuccess}
          self={this.props.viewer.user}
        />
      )
    } else {
      return this.props.children
    }
  }

  render () {
    return (
      <View>

        {this.uploader}

        <input
          type={'text'}
        />
      </View>
    )
  }
}


export default Relay.createContainer(
  ProjectNew, {
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
