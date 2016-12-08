import React, {Component} from 'react'
import S from 'styling/S'
import {btPurple, btWhite} from 'styling/T'
import btLogo from 'imgs/btLogo.png'


const base = {
  backgroundColor: btPurple,
  color: btWhite,
  height: '45px',
  width: '140px',
  borderRadius: '5px',
  fontSize: '13px',
  fontFamily: 'Helvetica Neue',
  fontWeight: 'bold',
  display: 'flex',
  alignContent: 'center',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  transition: 'background-color 1s'
}


const styles = new S({
  base,
})

class BTButton extends Component {

  state = {
    hovered: false
  }

  get hoverStyles () {
    if (this.state.hovered) {
      return {
        backgroundColor: '#a18af5',
      }
    } else {
      return {}
    }
  }

  handleMouseEnter = () => {
    this.setState({
      hovered: true
    })
  }

  handleMouseLeave = () => {
    this.setState({
      hovered: false
    })
  }

  get chooseIcon () {
    switch (this.props.icon) {
      case 'logo': {
        return btLogo
      }

      default: {
        return this.props.icon
      }

    }
  }

  render() {
    return (
      <button
        style={{
          ...styles.all,
          ...this.hoverStyles
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >

        <img
          src={this.chooseIcon}
          alt={'presentation'}
          style={{
            height: '40px',
            display: 'flex',
            marginLeft: '10px',
            marginRight: '10px'
          }}
        />

        <span
          style={{
            display: 'flex'
          }}
        >
          {this.props.children}
        </span>
      </button>
    )
  }

}

export default BTButton
