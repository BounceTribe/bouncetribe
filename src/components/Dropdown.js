import React, {Component} from 'react'
import styled from 'styled-components'
import {white, grey700, grey300, purple} from 'theme'
import {BtLink} from 'styled'

const DropdownContainer = styled.div`
  position: absolute;
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  margin: 0px 0px 40px 170px;
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
  margin-right: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 25px;

`

const DropLink = styled(BtLink)`
  font-size: 14px;
  color: ${grey700};
  &:hover {
    font-weight: 400;
    color: ${purple};
  }
`

class DropdownMenuItem extends Component {

  render() {
    return (
      <DropdownItem
        onClick={this.props.onClick}
      >
        <DropLink
          to={this.props.to}
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