import React, {Component} from 'react'
import styled from 'styled-components'
import PlayButton from 'imgs/icons/PlayButton'
import PauseButton from 'imgs/icons/PauseButton'
import {btLight, btTeal, btPurple} from 'styling/T'
import Draggable from 'react-draggable'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: flex-start;
  align-content: center;
  max-width: 800px;
  margin: 20px;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-content: center;
  min-width: 60px;
  margin-right: 20px;
`

const PlayPauseButton = styled.button`
  display: flex;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-bottom: 10px;
`

const TrackColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
  height: 100px;
`

const Waveform = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  height: 65px;
  width: 400px;
  position: absolute;
  box-sizing: border-box;
`

const Wave = styled.div`
  display: flex;
  box-sizing: border-box;
  height: 50%;
  width: 2px;
  padding: 0 1px;
  background-color: ${(props) => {
    if ((props.progress / 4) > props.index) {
      return btTeal
    } else {
      return btLight
    }
  }};
`

const Timer = styled.span`
  width: 100%;
  text-align: center;
`

const Cursor = styled.div`
  height: 100%;
  width: 1%;
  background-color: ${btPurple};
  display: flex;
  position: absolute;
`

class AudioPlayer extends Component {

  state = {
    playing: false,
    width: 400,
    currentTime: 0,
    position: {
      x: 0,
      y: 0
    }
  }

  componentDidMount () {
    const audioEl = this.audioEl

    audioEl.addEventListener('play', (e) => {
      console.log('play event')
      this.setState({
        playing: true
      })
    })

    audioEl.addEventListener('pause', (e) => {
      console.log('pause event')
      this.setState({
        playing: false
      })
    })

    audioEl.addEventListener('canplay', (e) => {
      this.setState({
        canPlay: true
      })
    })

    audioEl.addEventListener('durationchange', (e) => {
      this.setState({
        duration: Math.ceil(audioEl.seekable.end(0))
      })

      // var ctx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
      //
      // var audioSrc = ctx.createMediaElementSource(audioEl);
      //
      // console.log(audioSrc)
      //
      // var analyser = ctx.createAnalyser();
      //
      // console.log(analyser)
      //
      // audioSrc.connect(analyser);
      //
      // var frequencyData = new Uint8Array(analyser.frequencyBinCount);
      //
      // console.log(frequencyData)
      //
      // function renderFrame() {
      //    requestAnimationFrame(renderFrame);
      //    // update data in frequencyData
      //    analyser.getByteFrequencyData(frequencyData);
      //    // render frame based on values in frequencyData
      //    console.log(frequencyData)
      // }
      // audioEl.start();
      // renderFrame();


    })

    audioEl.addEventListener('timeupdate', (e) => {
      this.setState({
        currentTime: audioEl.currentTime,
        position: {
          x: this.position(audioEl.currentTime),
          y: 0
        }
      })
    })

  }

  position = (currentTime) => {
    let {
      width,
      duration
    } = this.state
    let multiplier = width / duration
    let newPosition = currentTime * multiplier
    return newPosition
  }

  time = (position) => {
    let {
      width,
      duration,
    } = this.state
    let multiplier = duration / width
    console.log('position', position)
    let newTime = position.x * multiplier
    console.log(newTime)
    return newTime
  }

  play = () => {
    this.audioEl.currentTime = this.state.currentTime
    this.audioEl.play()
  }

  pause = () => {
    this.audioEl.pause()
  }

  toggle = () => {
    if (this.state.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  seekClick = (i) => {
    let width = this.state.width
    let newWidth = i * (width/100)
    let newPosition = {
      x: newWidth,
      y: 0
    }
    let newTime = this.time(newPosition)


    this.setState({
      position: newPosition,
      currentTime: newTime
    })

    this.audioEl.currentTime = newTime
  }

  formatTime = (duration) => {

    if (!duration) {
      return '0:00'
    }

    let minutes = Math.floor(duration/60)
    let seconds = Math.floor(duration - (minutes * 60))

    if (seconds < 10) {
      seconds = `0${seconds}`
    }

    return `${minutes}:${seconds}`
  }

  get playPauseButton () {
    if (this.state.playing) {
      return (
        <PauseButton/>
      )
    } else {
      return (
        <PlayButton/>
      )
    }
  }

  createWaveform = () => {
    let waveform = []
    for(let i = 0; i < 100; i++) {
      waveform.push(
        <Wave
          key={i}
          index={i}
          onClick={()=>{
            console.log(i)
            this.seekClick(i)
          }}
          progress={this.state.position.x}
        />
      )
    }
    return waveform
  }

  cursorStop = (e, position) => {
    this.setState({
      position: {
        x: position.x,
        y: 0
      },
      currentTime: this.time(position)
    })
  }

  cursorDrag = (e, position) => {
    this.setState({
      position: {
        x: position.x,
        y: 0
      },
      currentTime: this.time(position)
    })
  }


  cursorStart = (e,position) => {
    this.setState({
      position: null
    })
  }



  render () {
    return (
      <Container
      >
        <Controls>
          <PlayPauseButton
            onClick={this.toggle}
          >
            {this.playPauseButton}
          </PlayPauseButton>
          <Timer>
          {this.formatTime(this.state.currentTime)}
          </Timer>

        </Controls>

        <TrackColumn>

          <Waveform>

            <Draggable
              axis={'x'}
              bounds="parent"
              onStart={this.cursorStart}
              onStop={this.cursorStop}
              onDrag={this.cursorDrag}
              position={this.state.position}
            >
              <Cursor
              />
            </Draggable>

            {this.createWaveform()}

          </Waveform>

        </TrackColumn>

        <audio
          preload={'auto'}
          ref={(ref) => {
            this.audioEl = ref
          }}
        >
          <source
            src={this.props.src}
            type={'audio/ogg'}
          />
        </audio>
      </Container>
    )
  }
}

export default AudioPlayer
