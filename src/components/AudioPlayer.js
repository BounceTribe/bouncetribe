import React, {Component} from 'react'
import Relay from 'react-relay'
import AudioVisualization from 'components/AudioVisualization'
import {Container} from 'styled/AudioPlayer'
import formatTime from 'utils/formatTime'

class AudioPlayer extends Component {

  componentDidMount () {
    let audio = this.audio

    audio.addEventListener('durationchange', (e) => {
      this.setState({
        duration: Math.ceil(audio.seekable.end(0))
      })
    })

    audio.addEventListener('canplay', (e) => {
      this.setState({
        canPlay: true
      })
    })
  }

  play = () => {
    this.audio.play()
    console.log(this.audio.currentTime)
  }

  pause = () => {
    this.audio.pause()
    console.log(this.audio.currentTime)
  }

  render () {
    return (
      <Container>
        <AudioVisualization
          visualization={this.props.viewer.File.visualization}
        />
        <button
          onClick={()=>{

          }}
        >
          Play
        </button>
        <button
          onClick={()=>{

          }}
        >
          Pause
        </button>
        <audio
          ref={(audio)=>{this.audio = audio}}
        >
          <source
            src={this.props.viewer.File.url}
          />
        </audio>
      </Container>
    )
  }
}

export default Relay.createContainer(
  AudioPlayer, {
    initialVariables: {
      trackId: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          File(id: $trackId) {
            url
            visualization
          }
        }
      `,
    },
  }
)
