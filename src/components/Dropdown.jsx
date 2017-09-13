import React, {Component} from 'react'
import styled from 'styled-components'
import {white, grey700, grey300, purple} from 'theme'
import {BtLink} from 'styled'

const DropdownContainer = styled.div`
  position: absolute;
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  margin: 0px 0px 40px 170px;
  z-index: 1000;
`

const DropdownUl = styled.ul`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  position: absolute;
  background-color: ${white};
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 5px;
  min-width: 175px;
  padding: 0;
  border: .5px solid ${grey300};
  &:before {
    content: "";
    position: absolute;
    top: 0%;
    margin-top: -15px;
    left:130px;
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
  flex-wrap: nowrap;
  background-color: ${white};
  box-sizing: border-box;
  padding: 8px 20px 8px 25px;
  color: ${grey700};
  &:hover {
    background-color: ${purple};
    color: ${white}
  }
`

const DropLink = styled(BtLink)`
  font-size: 14px;
  color: inherit;
`

class DropdownMenuItem extends Component {

  render() {
    return (
      <DropdownItem
        onClick={this.props.onClick}
      >
        <DropLink
          to={this.props.to}
          href={this.props.href}
        >
        {this.props.text}
      </DropLink>
      </DropdownItem>
    )
  }
}

const DropHr = styled.hr`
  display: flex;
  height: 1px;
  width: 100%;
  border: 0;
  background-color: ${grey300};
`

export {Dropdown, DropdownMenuItem, DropHr}
