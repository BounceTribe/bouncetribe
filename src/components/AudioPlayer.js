import React, {Component} from 'react'
import AudioVisualization from 'components/AudioVisualization'
import {Container, ButtonProgress, Progress} from 'styled/AudioPlayer'
import {RoundButton} from 'styled'
import formatTime from 'utils/formatTime'
import PlayArrow from 'material-ui/svg-icons/av/play-arrow'
import Pause from 'material-ui/svg-icons/av/pause'


class AudioPlayer extends Component {

  state = { time: 0, }

  componentDidMount () {
    let audio = this.audio
    audio.addEventListener('durationchange', e => {
      this.setState({ duration: Math.ceil(audio.seekable.end(0)) })
      if (this.props.getDuration) this.props.getDuration(audio.seekable.end(0))
    })

    audio.addEventListener('canplay', e => this.setState({canPlay: true}) )

    audio.addEventListener('timeupdate', e => {
      this.setState( (prevState,props) => {
        if (this.props.setCurrentTime)
          this.props.setCurrentTime(audio.currentTime)
        return {time: audio.currentTime}
      })
    })
  }

  play = () => {
    this.audio.play()
    this.setState({ playing: true })
  }
  pause = () => {
    this.audio.pause()
    this.setState({ playing: false })
  }
  toggle = () => this.state.playing ? this.pause() : this.play()

  get buttonIcon () {
    if (this.state.playing) {
      return ( <Pause viewBox={'4 5 15 15'} /> )
    } else {
      return ( <PlayArrow viewBox={'4 5 15 15'} /> )
    }
  }

  time = () => {
    let {time, duration} = this.state
    if (duration) {
      return (<span>{formatTime(time)}</span>)
    }
  }

  scrub = ({e, newTime}) => {
    let width , click, newPosition
    if (e) {
      width = e.target.clientWidth
      click = e.nativeEvent.offsetX
      newPosition = click / width
    }
    newTime = newTime || this.state.duration * newPosition
    console.log(' newTime, newposition, click', newTime, newPosition, click);
    this.setState((prevState, props)=>{
      this.audio.currentTime = newTime
      return {time: newTime}
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track.url !== this.props.track.url) {
      console.log("this.audio", this.audio )
    }
    if (nextProps.jumpToTime!==this.props.jumpToTime) {
      console.log('jump to!', nextProps, this.props);
      this.scrub({newTime: nextProps.jumpToTime})
    }
  }

  render () {
    let {track} = this.props
    return (
      <Container>
        <ButtonProgress>
          <RoundButton onClick={this.toggle} icon={this.buttonIcon} />
          <Progress>{this.time()}</Progress>
        </ButtonProgress>
        <AudioVisualization
          visualization={track.visualization}
          scrub={(e)=>this.scrub({e})}
          duration={this.state.duration}
          time={this.state.time}
          project={this.props.project}
        />
        <audio loop ref={(audio)=>{this.audio = audio}} >
          <source src={track.url} />
        </audio>
      </Container>
    )
  }
}

export default AudioPlayer
