import React, {Component} from 'react'
import styled from 'styled-components'

const DropdownContainer = styled.ul`
  display: flex;
  position: absolute;
  background-color: white;
  color: black;
  flex-direction: column;
  padding: 5px 15px;
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
