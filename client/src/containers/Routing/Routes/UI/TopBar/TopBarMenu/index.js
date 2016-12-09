import React, {Component} from 'react'
import S from 'styling/S'
import TopBarMenuItem from './TopBarMenuItem'
import AuthContainer from 'reusables/AuthContainer'
import projectIcon from 'imgs/project.svg'
// import sessionIcon from 'imgs/session.svg'
import notifications from 'imgs/notifications.svg'


const topBarMenuBase = {
  display: 'flex'
}

const topBarMenu = new S({
  base: topBarMenuBase
})



class TopBarMenu extends Component {
  get showMenu() {
    if (this.props.isLoggedIn) {
      let handle = this.props.viewer.user.handle
      return ([
        <TopBarMenuItem
          text={'Projects'}
          key='projects'
          to={`/${handle}/projects`}
          icon={projectIcon}
        />,
        <TopBarMenuItem
          text={'Notifications'}
          key='notifications'
          icon={notifications}
        />
      ])
    }
  }

  get showUserDropdown() {
    if (this.props.isLoggedIn) {
      let handle = this.props.viewer.user.handle
      return ([
        <TopBarMenuItem
          text={'Profile'}
          key='profile'
          to={`/${handle}`}
        />,
        <TopBarMenuItem
          text={'My Tribe'}
          key='myTribe'
          to={`/${handle}/tribe`}
        />,
        <TopBarMenuItem
          text={'Settings'}
          key='settings'
          to={`/${handle}/settings`}
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
            isLoggedIn={this.props.isLoggedIn}
            dropDown={
              <div>
                {this.showUserDropdown}
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
