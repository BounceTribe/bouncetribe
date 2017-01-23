import React, {Component} from 'react'
import {MarkerContainer, Marker} from 'styled/Project'

class CommentMarkers extends Component {

  state = {
    left: 0,
    top: 0,
    wide: 0
  }

  componentWillReceiveProps() {
    let canvas = document.getElementsByTagName('canvas')[0]
    this.setState({
      left: canvas.offsetLeft,
      top: canvas.offsetTop + 100, //100 is the visualization height
      wide: canvas.clientWidth
    })
  }

  get markers () {
    return this.props.project.comments.edges.map(edge=>{
      let {node: comment} = edge
      let left = (comment.timestamp / this.props.duration) * 100
      console.log(comment.timestamp, this.props.duration)
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
