import React, {Component} from 'react'
import Relay from 'react-relay'
import AudioVisualization from 'components/AudioVisualization'
import {Container} from 'styled/AudioPlayer'
import formatTime from 'utils/formatTime'

class AudioPlayer extends Component {

  state = {
    time: 0,
  }

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

    audio.addEventListener('timeupdate', (e) => {
      console.log('timeupdate')
      this.setState( (prevState,props) => {
        return {
          time: audio.currentTime
        }
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

  time = () => {
    let {time, duration} = this.state
    if (duration) {
      return (
        <span>{formatTime(time)} / {formatTime(duration)}</span>
      )
    }
  }

  scrub = (e) => {

    let width = e.target.clientWidth
    let click = e.nativeEvent.offsetX

    let newPosition = click / width
    let newTime = this.state.duration * newPosition

    this.setState((prevState, props)=>{
      this.audio.currentTime = newTime
      return {
        time: newTime
      }
    })

  }

  render () {
    return (
      <Container>
        <AudioVisualization
          visualization={this.props.viewer.File.visualization}
          scrub={this.scrub}
          duration={this.state.duration}
          time={this.state.time}
        />
        <button
          onClick={this.play}
        >
          Play
        </button>
        <button
          onClick={this.pause}
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

        {this.time()}
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
