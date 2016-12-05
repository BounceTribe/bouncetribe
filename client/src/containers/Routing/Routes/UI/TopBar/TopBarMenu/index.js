import React, {Component} from 'react'
import S from 'styling/S'
import TopBarMenuItem from './TopBarMenuItem'
import AuthContainer from 'reusables/AuthContainer'

const topBarMenuBase = {
  display: 'flex'
}

const topBarMenu = new S({
  base: topBarMenuBase
})



class TopBarMenu extends Component {
  get showMenu() {
    if (this.props.user) {
      return ([
        <TopBarMenuItem
          text={'Projects'}
          key='projects'
          to={'/projects'}
        />,
        <TopBarMenuItem
          text={'Notifications'}
          key='notifications'
        />
      ])
    }
  }

  get showUserDropdown() {
    if (this.props.user) {
      return ([
        <TopBarMenuItem
          text={'Profile'}
          key='profile'
          to='/profile'
        />,
        <TopBarMenuItem
          text={'My Tribe'}
          key='myTribe'
          to='/tribe'
        />
      ])
    }
  }

  render () {
    return (
        <menu
          style={{
            ...topBarMenu.all
          }}
        >

          {this.showMenu}

          <TopBarMenuItem
            text={this.props.user ? this.props.user.name : 'Login or Signup'}
            dropDown={
              <div>
                {this.showUserDropdown}
                <AuthContainer
                  router={this.props.router}
                />
              </div>
            }
          />
        </menu>
    )
  }
}

export default TopBarMenu
