import React, {Component} from 'react'
import {btLight, btWhite, btMedium} from 'styling/T'

class InfluenceChip extends Component {
  // constructor() {
  //   super()
  // }
  state = {
    hovered: false
  }

  handleMouseOver = () => {
    this.setState({
      hovered: true
    })
  }

  handleMouseOut = () => {
    this.setState({
      hovered: false
    })
  }

  handleDelete = () => {
    let fields = {
      influenceId: this.props.influenceId
    }
    this.props.deleteInfluence(fields)
  }

  render() {
    return (
      <div
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        style={{
          height: '30px',
          backgroundColor: btLight,
          color: btWhite,
          display: 'inline-flex',
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '30px'
        }}
      >
        <img
          src={this.props.artist.imageUrl}
          alt='presentation'
          style={{
            width: '30px',
            height: '100%',
            display: 'flex',
            borderRadius: '30px'
          }}
        />
        <span
          style={{
            display: 'flex',
            marginLeft: '10px',
            marginRight: 'auto'

          }}
        >{this.props.artist.name}</span>
        <button
          onClick={this.handleDelete}
          style={{
            height:'30px',
            width: '30px',
            borderRadius: '30px',
            backgroundColor: btMedium,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: (this.state.hovered) ? '1' : '0',
            transition: 'all .5s ease',
            marginLeft: '10px'
          }}
        >X</button>
      </div>
    )
  }
}

export default InfluenceChip
