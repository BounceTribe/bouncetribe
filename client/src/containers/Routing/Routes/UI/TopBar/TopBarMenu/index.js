import React, {Component} from 'react'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import projectIcon from 'imgs/project.svg'
import notification from 'imgs/icons/notification'
import {connect} from 'react-redux'
import {logout} from 'actions/auth'
import styled from 'styled-components'
import {Link} from 'react-router'

const MenuRow = styled.div`
  display: flex;
  flex-direction: row;
`

class TopBarMenu extends Component {
  get showMenu() {
    if (this.props.isLoggedIn) {
      let {
        handle,
        name,
        profilePicUrl
      } = this.props.user
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
            icon={notification}
          />
          <TopBarMenuItem
            text={`${name}`}
            icon={profilePicUrl}
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
                <Link
                  onClick={this.props.logout}
                >
                  Logout
                </Link>
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
  return {
    isLoggedIn: state.auth['id_token'],
    user: state.auth.user
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
