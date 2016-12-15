import React, {Component} from 'react'
import logo from 'imgs/logo.svg'
import styled from 'styled-components'
import {btPurple, btWhite, btTeal, btWarn, btMedium, fbBlue, btLight, btDark, btTealActive, btPurpleActive} from 'styling/T'

const justifyContent = (props) => {
  if (props.text && props.icon) {
    return 'flex-start'
  } else {
    return 'center'
  }
}

const setColor = (props) => {
  if (props.danger) {
    return btWarn
  } else if (props.teal) {
    return btTeal
  } else if (props.grey) {
    return btMedium
  } else if (props.fb) {
    return fbBlue
  } else {
    return btPurple
  }
}

const setActiveColor = (props) => {
  if (props.danger) {
    return btWarn
  } else if (props.teal) {
    return btTealActive
  } else if (props.grey) {
    return btMedium
  } else if (props.fb) {
    return fbBlue
  } else {
    return btPurpleActive
  }
}

const Button = styled.button`
  border-radius: 5px;
  height: ${props => (props.flex) ? '1.5em' : '45px'};
  width: ${props => (props.flex) ? '100%' : '140px'};
  font-size: 1em;
  font-family: 'Helvetica Neue';
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: ${props => justifyContent(props)};
  align-items: center;
  background: ${props =>  setColor(props)};
  color: ${btWhite};
  transition: all .20s;
  box-shadow: 0px 2px #999;
  cursor: pointer;

  &:after {
    content: '';
    display: block;
    width: 0;
    height: ${props => (props.flex) ? '1.5em' : '45px'};
    background: linear-gradient(to right, rgba(255,255,255,0) 30%, rgba(255,255,255,.08) 80%, rgba(255,255,255,0));
    border-right: solid rgba(255,255,255,0) 0px;
    position: absolute;
    transition: all .10s;
  }

  &:hover:after {
    width: ${props => (props.flex) ? '100%' : '140px'};
    transition: all .20s;
  }

  &:active {
    background: ${props=>setActiveColor(props)};
    transform: translateY(2px);
    transition: all .20s;
  }

  &:disabled {
    cursor: not-allowed;
    background-image: linear-gradient(to right, rgba(200,200,200,.7) 30%, rgba(200,200,200,.8) 80%, rgba(200,200,200,.7));
    border: 1px inset ${btLight};
    box-shadow: none;
    text-shadow: 1px 1px ${btDark};
    transition: all .10s;
  }

`

const ButtonImg = styled.img`
  height: 40px;
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
`


const ButtonText = styled.span`
  display: flex;
`

class BTButton extends Component {

  get chooseIcon () {
    switch (this.props.icon) {
      case 'logo': {
        return logo
      }

      default: {
        return this.props.icon
      }

    }
  }

  get useIcon () {
    if (this.props.icon) {
      return (
        <ButtonImg
          src={this.chooseIcon}
          alt={'presentation'}
        />
      )
    }
  }

  get useText () {
    if (this.props.text) {
      return (
        <ButtonText
        >
          {this.props.text}
        </ButtonText>
      )
    }
  }

  render() {
    const {
      useIcon,
      useText
    } = this
    return (
      <Button
        onClick={this.props.onClick ? this.props.onClick : null}
        teal={this.props.teal}
        danger={this.props.danger}
        grey={this.props.grey}
        flex={this.props.flex}
        fb={this.props.fb}
        disabled={this.props.disabled}
      >
        {useIcon}

        {useText}

      </Button>
    )
  }

}

export default BTButton
