import React, {Component} from 'react'
import S from 'styling/S'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import projectIcon from 'imgs/project.svg'
import notifications from 'imgs/notifications.svg'
import {connect} from 'react-redux'
import {logout} from 'actions/auth'
import BTButton from 'reusables/BTButton'

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
          text={'Stuff'}
          key={'stuff'}
          dropdown={[

              <TopBarMenuItem
                text={'Profile'}
                key={'profile'}
                to={`/${handle}`}
              />,
              <TopBarMenuItem
                text={'My Tribe'}
                key={'tribe'}
                to={`/${handle}/tribe`}
              />,
              <TopBarMenuItem
                text={'Settings'}
                key={'settings'}
                to={`/${handle}/settings`}
              />,
              <BTButton
                onClick={this.props.logout}
                key={'logout'}
                text={'Logout'}
                danger
                flex
              />
          ]}
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
