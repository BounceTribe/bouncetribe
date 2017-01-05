import React, {Component} from 'react'
import {Link} from 'react-router'
import styled from 'styled-components'
import TopBarMenuItemDropdown from 'reusables/TopBarMenuItemDropdown'
import onClickOutside from 'react-onclickoutside'
import {btPurple} from 'styling/T'

const MenuItemContainer = styled.li`
  display: flex;
  margin-left: 20px;
`

const MenuItemRow =  styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
`

const IconSpan = styled.span`
  margin-right: 5px;
  height: 14px;
  width: 14px;
`

const DropdownColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
    this.setState({
      showDropdown: !this.state.showDropdown
    })
  }

  get showIcon () {
    if (this.props.icon) {
      const Icon = this.props.icon
      return (
        <IconSpan>
          <Icon
            fill={btPurple}
          />
        </IconSpan>
      )
    }
  }

  render() {
    return (
      <DropdownColumn>

        <MenuItemContainer
          onClick={(e)=> {
            if (this.props.onClick) {
              this.props.onClick()
            } else {
              this.toggleDropdown(e)
            }
          }}
        >
            <Link
              to={this.props.to}
            >
              <MenuItemRow>
                {this.showIcon}
                {this.props.children}
                {this.props.text}
              </MenuItemRow>
            </Link>

      </MenuItemContainer>
      {this.showDropdown}

    </DropdownColumn>

    )
  }
}

TopBarMenuItem = onClickOutside(TopBarMenuItem)

export default TopBarMenuItem
