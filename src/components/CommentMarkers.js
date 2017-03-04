import React, {Component, PropTypes} from 'react'
import {MarkerContainer, Marker} from 'styled/Project'

class CommentMarkers extends Component {

  static contextTypes = {
    duration: PropTypes.number,
  }

  state = {
    left: 0,
    top: 0,
    wide: 0
  }

  componentWillReceiveProps() {
    if (this.state.wide === 0) {
      let canvas = document.getElementsByTagName('canvas')[0]
      this.setState({
        left: canvas.offsetLeft,
        top: canvas.offsetTop + 105, //100 is the visualization height
        wide: canvas.clientWidth
      })
    }
  }

  get markers () {
    return this.props.comments.edges.map(edge=>{
      let {node: comment} = edge
      let left = (comment.timestamp / this.context.duration) * 100 //making a percentage
      return (
        <Marker
          key={comment.id}
          left={left}
        />
      )
    })
  }

  render () {
    let {left, top, wide} = this.state
    return (
      <MarkerContainer
        left={left}
        top={top}
        wide={wide}
      >
        {this.markers}
      </MarkerContainer>
    )
  }
}

export default CommentMarkers
