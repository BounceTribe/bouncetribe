import React, {Component} from 'react'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import DropdownMenuItem from 'reusables/DropdownMenuItem'
import {connect} from 'react-redux'
import {logout} from 'actions/auth'
import styled from 'styled-components'
import notes from 'imgs/icons/notes'
import notification from 'imgs/icons/notification'

const MenuRow = styled.div`
  display: flex;
  flex-direction: row;
`
const DropHr = styled.hr`
  color: rgb(220,220,240);
  background: rgb(220,220,240);
  height: 1px;
  border: 0px;
`

const ProfilePic = (props) => {
  return (
    <img
      src={props.profilePicUrl}
      role='presentation'
      style={{
        height: '18px',
        borderRadius: '18px',
      }}
    />
  )
}

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
            icon={notes}
          />
          <TopBarMenuItem
            icon={notification}
          />
          <TopBarMenuItem
            text={`${name}`}
            icon={()=>{
              return (
                <ProfilePic
                  profilePicUrl={profilePicUrl}
                />
              )
            }}
            dropdown={(
              <div>
                <DropdownMenuItem
                  text={'View Profile'}
                  to={`/${handle}`}
                />
                <DropdownMenuItem
                  text={'My Tribe'}
                  to={`/${handle}/tribe`}
                />
                <DropHr/>
                <DropdownMenuItem
                  text={'Settings'}
                  to={`/settings`}
                />
                <DropdownMenuItem
                  text={'Help'}
                />
                <DropHr/>
                <DropdownMenuItem
                  text={'Logout'}
                  onClick={this.props.logout}
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
