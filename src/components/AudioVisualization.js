import React, {Component} from 'react'

class AudioVisualization extends Component {

  state = {
    height: 0,
    width: 0
  }

  draw = () => {
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
    for (let i = 0; i < width; i++) {
      let top = (height - data[i]) / 2
      let step = i * 3
      c.beginPath()
      c.moveTo(step,top)
      c.lineTo(step, top+data[i])
      c.stroke()
    }
  }

  componentDidMount () {
    let parentWidth = this.canvas.parentElement.clientWidth
    this.setState((prevState,props)=>{
      return {
        width: parentWidth * .8,
        height: 200
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.width === 0) {
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
      />
    )
  }
}

export default AudioVisualization
