import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {MarkerContainer, Marker} from 'styled/Project'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import {white, purple} from 'theme'

class CommentMarkers extends Component {

  static contextTypes = {
    duration: PropTypes.number,
  }

  state = { left: 0, top: 0, wide: 0 }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setWidth);
  }

  componentDidMount () {
    window.addEventListener("resize", this.setWidth);
    this.setWidth()
  }

  componentWillReceiveProps() {
    if (this.state.wide === 0) {
      this.setWidth()
    }
  }

  setWidth = () => {
    let canvas = document.getElementsByTagName('canvas')[0]
    this.setState({
      left: canvas.offsetLeft,
      top: canvas.offsetTop + 105, //100 is the visualization height
      wide: canvas.clientWidth
    })
  }

  get markers () {
    return this.props.comments.map(comment=>{
      let left = (comment.timestamp / this.context.duration) * 100 //making a percentage
      return (
        <Marker
          onClick={()=>{
            let el = document.getElementById(comment.id)
            el.scrollIntoView({behavior:'smooth', block: 'start'})
            el.style.backgroundColor = purple
            setTimeout(()=>{
              el.style.backgroundColor = white
              el.style.transition = 'background-color 2s'
            }, 400)
          }}
          
          key={comment.id}
          className={comment.id}
          left={left}
          comment={(comment.type === 'COMMENT')}
        >
          {(comment.type === 'COMMENT') ?
          <Comment height={12} width={12} fill={white} />
          :
          <Heart height={12} width={12} fill={white} />
          }
        </Marker>
      )
    })
  }

  render () {
    let {left, top, wide} = this.state
    return (
      <MarkerContainer left={left} top={top} wide={wide} >
        {this.markers}
      </MarkerContainer>
    )
  }
}

export default CommentMarkers
