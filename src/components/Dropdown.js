import React, {Component} from 'react'
import styled from 'styled-components'
import {white, grey500} from 'theme'
import {BtLink} from 'styled'

const DropdownContainer = styled.div`
  position: absolute;
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  margin: 0px 0px 40px 150px;
`

const DropdownUl = styled.ul`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  position: absolute;
  background-color: ${white};
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 5px;
  min-width: 160px;
  &:before {
    content: "";
    position: absolute;
    top: 0%;
    margin-top: -15px;
    left:145px;
    border: solid 10px transparent;
    border-bottom-color: white;
    z-index: 1;
}
`

class Dropdown extends Component {

  render() {
    return (
        <DropdownContainer
          hide={this.props.hide}
        >
          <DropdownUl
            onMouseLeave={this.props.close}
          >
            {this.props.children}
          </DropdownUl>
        </DropdownContainer>
    )
  }
}



const DropdownItem = styled.li`
  display: flex;
  align-self: flex-start;
  background-color: ${white};
  color: ${grey500};
  margin-right: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  &:hover {
    font-weight: 400;
  }
`

class DropdownMenuItem extends Component {

  render() {
    return (
      <DropdownItem>
        <BtLink
          to={this.props.to}
          onClick={this.props.onClick}
        >
        {this.props.text}
        </BtLink>
      </DropdownItem>
    )
  }
}

export {Dropdown, DropdownMenuItem}
