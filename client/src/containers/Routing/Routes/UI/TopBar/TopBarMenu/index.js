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
    if (this.props.isLoggedIn) {
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
    if (this.props.isLoggedIn) {
      return ([
        <TopBarMenuItem
          text={'Profile'}
          key='profile'
          to={`/profile`}
        />,
        <TopBarMenuItem
          text={'My Tribe'}
          key='myTribe'
          to={`/tribe`}
        />,
        <TopBarMenuItem
          text={'Settings'}
          key='settings'
          to={`/settings`}
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
            text={this.props.isLoggedIn ? 'Your Profile' : 'Login or Signup'}
            dropDown={
              <div>
                {this.showUserDropdown}
                <h2>AuthContainer</h2>
                <AuthContainer
                  router={this.props.router}
                  viewer={this.props.viewer}
                />
              </div>
            }
          />
        </menu>
    )
  }
}

export default TopBarMenu
