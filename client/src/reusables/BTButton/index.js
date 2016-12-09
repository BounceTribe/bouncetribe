import React, {Component} from 'react'
import btLogo from 'imgs/btLogo.png'
import styled from 'styled-components'
import {btPurple, btWhite} from 'styling/T'

const justifyContent = (props) => {
  if (props.text && props.icon) {
    return 'flex-start'
  } else {
    return 'center'
  }
}

const Button = styled.button`
  border-radius: 5px;
  height: 45px;
  width: 140px;
  font-size: 13px;
  font-family: 'Helvetica Neue';
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: ${props => justifyContent(props)};
  align-items: center;
  background: ${btPurple};
  color: ${btWhite};
  transition: all .20s;
  box-shadow: 0px 2px #999;

  &:after {
    content: '';
    display: block;
    width: 0;
    height: 45px;
    background: linear-gradient(to right, rgba(255,255,255,0) 30%, rgba(255,255,255,.08) 80%, rgba(255,255,255,0));
    border-right: solid rgba(255,255,255,0) 0px;
    position: absolute;
    transition: all .10s;
  }

  &:hover:after {
    width: 140px;
    transition: all .20s;
  }

  &:active {
    background: rgb(114, 69, 237);
    transform: translateY(2px);
    transition: all .20s;
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
        return btLogo
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
      >
        {useIcon}

        {useText}

      </Button>
    )
  }

}

export default BTButton
