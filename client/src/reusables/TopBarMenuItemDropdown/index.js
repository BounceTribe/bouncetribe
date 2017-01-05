import React, {Component} from 'react'
import styled from 'styled-components'
import {btBlack, btWhite} from 'styling/T'

const DropdownContainer = styled.ul`
  display: flex;
  position: relative;
  background-color: ${btWhite};
  color: ${btBlack};
  flex-direction: column;
  border-radius: 5px;
  margin: 10px 0;

  :before {
    content: "";
    position: absolute;
    top: 0%;
    margin-top: -15px;
    left:100px;
    border: solid 10px transparent;
    border-bottom-color: white;
    z-index: 1;
}
`


class TopBarMenuItemDropdown extends Component {

  render() {
    return (
        <DropdownContainer>
          {this.props.children}
        </DropdownContainer>
    )
  }
}

export default TopBarMenuItemDropdown
