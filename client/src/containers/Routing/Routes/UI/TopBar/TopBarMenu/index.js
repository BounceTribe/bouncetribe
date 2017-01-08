import React, {Component} from 'react'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import DropdownMenuItem from 'reusables/DropdownMenuItem'
// import {connect} from 'react-redux'
import auth from 'config/auth'
import styled from 'styled-components'
import notes from 'imgs/icons/notes'
import notification from 'imgs/icons/notification'
import {btMedium} from 'styling/T'

const MenuRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 15px;
`
const DropHr = styled.hr`
  color: rgb(220,220,240);
  background: rgb(220,220,240);
  height: 1px;
  border: 0px;
`

const ProfilePic = styled.img`
  display: flex;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  position: absolute;
  margin-top: -10px;
`

const ProfileInfoRow = styled.div`
  display: flex;
  flex-direction: row;
`

const ProfileName = styled.span`
  display: flex;
  margin-left: 45px;
`

const DownTriangle = styled.div`
  display: flex;
  width: 0;
  height: 0;
  margin-top: 5px;
  margin-left: 4px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${btMedium};
`

class TopBarMenu extends Component {
  get showMenu() {
    console.log('showMenu', this.props)
    if (this.props.viewer.user) {
      let {
        handle,
        name,
        profilePicUrl,
        profilePicThumb
      } = this.props.viewer.user
      return (
        <MenuRow>
          {/* <TopBarMenuItem
            to={'/admin'}
            text={'Admin'}
          /> */}
          <TopBarMenuItem
            text={'Share Project'}
            to={`/${handle}/projects`}
            icon={notes}
          />
          <TopBarMenuItem
            icon={notification}
          />
          <TopBarMenuItem
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
                />
                <DropdownMenuItem
                  text={'Help'}
                />
                <DropHr/>
                <DropdownMenuItem
                  text={'Logout'}
                  onClick={auth.logout}
                />
              </div>
            )}
          >
            <ProfileInfoRow>

              <ProfilePic
                src={profilePicThumb || profilePicUrl}
                role='presentation'
              />

              <ProfileName>
                {name}
              </ProfileName>
              <DownTriangle/>
            </ProfileInfoRow>
          </TopBarMenuItem>
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

// const mapStateToProps = (state) => {
//   return {
//     isLoggedIn: state.auth['id_token'],
//     user: state.auth.user
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     logout: () => {
//       dispatch(logout())
//     },
//   }
// }
//
// TopBarMenu = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(TopBarMenu)

export default TopBarMenu
