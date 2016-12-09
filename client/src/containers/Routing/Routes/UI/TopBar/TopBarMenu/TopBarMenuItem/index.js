import React, {Component} from 'react'
import S from 'styling/S'
import {Popover, PopoverAnimationVertical} from 'material-ui'
import {Link} from 'react-router'

const topBarMenuItemBase = {
  display: 'flex',
  marginLeft: '15px'
}

const topBarMenuItem = new S({
  base: topBarMenuItemBase
})

class TopBarMenuItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  handleTouchTap = (event) => {
    event.preventDefault()
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.isLoggedIn) {
      this.handleRequestClose()
    }
  }

  get hasDropDown() {
    if (this.props.dropDown) {
      return (
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          {this.props.dropDown}
        </Popover>
      )
    }
  }

  render() {
    return (
        <div
          style={{
            ...topBarMenuItem.all
          }}
          onTouchTap={this.handleTouchTap}
        >
          <Link
            to={this.props.to}
          >
            <img
              src={this.props.icon}
              role='presentation'
            />
            <span>
              {this.props.text}
              {this.props.children}
            </span>
          </Link>

          {this.hasDropDown}
        </div>
    )
  }
}

export default TopBarMenuItem
