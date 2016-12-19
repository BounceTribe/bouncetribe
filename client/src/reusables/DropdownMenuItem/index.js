import React, {Component} from 'react'
import styled from 'styled-components'
import {btBlack, btWhite} from 'styling/T'
import {Link} from 'react-router'

const DropdownItem = styled.li`
  display: flex;
  background-color: ${btWhite};
  color: ${btBlack};
  margin-left: 20px;
  margin-right: 30px;
  margin-top: 8px;
  margin-bottom: 8px;
`

class DropdownMenuItem extends Component {

  render() {
    return (
      <Link
        to={this.props.to}
        onClick={this.props.onClick}
      >
        <DropdownItem>
          {this.props.text}
        </DropdownItem>

      </Link>
    )
  }
}

export default DropdownMenuItem
