import React, {Component} from 'react'
import S from 'styling/S'
import TopBarMenuItem from './TopBarMenuItem'
import projectIcon from 'imgs/project.svg'
// import sessionIcon from 'imgs/session.svg'
import notifications from 'imgs/notifications.svg'
import {connect} from 'react-redux'
import {logout} from 'actions/auth'


const topBarMenuBase = {
  display: 'flex'
}

const topBarMenu = new S({
  base: topBarMenuBase
})



class TopBarMenu extends Component {
  get showMenu() {
    if (this.props.isLoggedIn) {
      let handle = this.props.handle
      return ([
        <TopBarMenuItem
          text={'Projects'}
          key='projects'
          to={`/${handle}/projects`}
          icon={projectIcon}
        />,
        <TopBarMenuItem
          key='notifications'
          icon={notifications}
        />,
        <TopBarMenuItem
          text={'Your Profile'}
          key={'profile'}
          to={`/${handle}`}
        />
      ])
    }
  }
  // 
  // get showUserDropdown() {
  //   if (this.props.isLoggedIn) {
  //     let handle = 'profile'
  //     return ([
  //       <TopBarMenuItem
  //         text={'Profile'}
  //         key='profile'
  //         to={`/${handle}`}
  //       />,
  //       <TopBarMenuItem
  //         text={'My Tribe'}
  //         key='myTribe'
  //         to={`/${handle}/tribe`}
  //       />,
  //       <TopBarMenuItem
  //         text={'Settings'}
  //         key='settings'
  //         to={`/${handle}/settings`}
  //       />
  //     ])
  //   }
  // }

  render () {
    return (
        <menu
          style={{
            ...topBarMenu.all
          }}
        >

          {this.showMenu}


        </menu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth['id_token'],
    handle: state.auth.user.handle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout())
    },
  }
}

TopBarMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBarMenu)

export default TopBarMenu
