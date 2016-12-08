import React, {Component} from 'react'
import logo from 'imgs/btLogo.png'
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
          src={logo}
          alt='presentation'
          style={{
            height: '100%',
            display: 'flex',
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
