import React, {Component} from 'react'
import {Link} from 'react-router'
import styled from 'styled-components'
import TopBarMenuItemDropdown from 'reusables/TopBarMenuItemDropdown'
import onClickOutside from 'react-onclickoutside'

const MenuItemContainer = styled.li`
  display: flex;
  margin-left: 10px;
`

class TopBarMenuItem extends Component {

  state = {
    showDropdown: false
  }

  handleClickOutside () {
    this.setState({
      showDropdown: false
    })
  }

  get showDropdown() {
    if (this.props.dropdown && this.state.showDropdown) {
      return (
        <TopBarMenuItemDropdown>
          {this.props.dropdown}
        </TopBarMenuItemDropdown>
      )
    }
  }

  toggleDropdown = (e) => {
    console.log('hello', this.state.showDropdown)
    this.setState({
      showDropdown: !this.state.showDropdown
    })
  }

  render() {
    return (
      <div>
        <MenuItemContainer
          onClick={(e)=> {this.toggleDropdown(e)}}
        >
          <Link
            to={this.props.to}
          >
            <img
              src={this.props.icon}
              role='presentation'
              style={{
                maxHeight: '1em',
                marginRight: '5px',
                height: '100%'
              }}
            />
            <span>
              {this.props.text}
              {this.props.children}
            </span>
          </Link>
        </MenuItemContainer>
        {this.showDropdown}
      </div>
    )
  }
}

TopBarMenuItem = onClickOutside(TopBarMenuItem)

export default TopBarMenuItem
