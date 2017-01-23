import React, {Component} from 'react'
import {purple, grey150} from 'theme'

class AudioVisualization extends Component {

  state = {
    height: 0,
    width: 0
  }

  draw = () => {
    let {duration, time} = this.props
    let progress = 0
    if (duration && time) {
      progress = time / duration
    }

    let {visualization} = this.props
    let {
      width,
      height
    } = this.state
    let c = this.canvas.getContext('2d')
    let min = Math.min(...visualization)
    let zeroDif = min * -1

    let data = visualization.map(val=>{
      val += zeroDif
      return val * 100
    })
    for (let i = 0; i < width; i+=3) {

      let position = i / width
      let sample = Math.floor(position * data.length)

      let top = (height - data[sample]) / 2
      c.beginPath()
      if (position < progress && c.strokeStyle !== purple) {
        c.strokeStyle = purple
      }
      if (position >= progress && c.strokeStyle !== grey150){
        c.strokeStyle = grey150
      }
      c.moveTo(i,top)
      c.lineTo(i, top+data[sample])
      c.stroke()
    }
  }

  componentDidMount () {
    let parentWidth = this.canvas.parentElement.clientWidth
    this.setState((prevState,props)=>{
      return {
        width: parentWidth * .8,
        height: 100
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.width === 0 ) {
      this.draw()
    }
  }

  componentWillReceiveProps (prevProps) {
    if (prevProps.time !== this.props.time) {
      let c = this.canvas.getContext('2d')
      c.clearRect(0, 0, this.state.width, this.state.height)
      this.draw()
    }
  }

  render () {
    return (
      <canvas
        ref={(canvas) => {
          this.canvas = canvas
        }}
        width={this.state.width}
        height={this.state.height}
        onClick={(e)=>this.props.scrub(e)}
      />
    )
  }
}

export default AudioVisualization
