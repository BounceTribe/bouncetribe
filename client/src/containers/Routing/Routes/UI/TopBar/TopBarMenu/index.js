import React, {Component} from 'react'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import projectIcon from 'imgs/project.svg'
import notifications from 'imgs/notifications.svg'
import {connect} from 'react-redux'
import {logout} from 'actions/auth'
import BTButton from 'reusables/BTButton'
import styled from 'styled-components'


const MenuRow = styled.div`
  display: flex;
  flex-direction: row;
`

class TopBarMenu extends Component {
  get showMenu() {
    if (this.props.isLoggedIn) {
      let handle = this.props.handle
      return (
        <MenuRow>
          {/* <TopBarMenuItem
            to={'/admin'}
            text={'Admin'}
          /> */}
          <TopBarMenuItem
            text={'Projects'}
            to={`/${handle}/projects`}
            icon={projectIcon}
          />
          <TopBarMenuItem
            icon={notifications}
          />
          <TopBarMenuItem
            text={'Stuff'}
            dropdown={(
              <div>
                <TopBarMenuItem
                  text={'Profile'}
                  to={`/${handle}`}
                />
                <TopBarMenuItem
                  text={'My Tribe'}
                  to={`/${handle}/tribe`}
                />
                <BTButton
                  onClick={this.props.logout}
                  text={'Logout'}
                  danger
                  flex
                />
              </div>
            )}
          />
        </MenuRow>
      )
    }
  }
  render () {
    return (
        <menu>

          {this.showMenu}

        </menu>
    )
  }
}

const mapStateToProps = (state) => {
  const handle = () => {
    if (state.auth.user) {
      return state.auth.user.handle
    } else {
      return 'profile'
    }
  }
  return {
    isLoggedIn: state.auth['id_token'],
    handle: handle()
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
