import React, {Component} from 'react'
import {Bar, Logo, NavList, NavLink, Portrait, NavText, Notification} from 'styled/TopNav'
import {BtFlatButton} from 'styled'
import {white, purple} from 'theme'
import Plus from 'icons/Plus'
import Music from 'icons/Music'
import Headphones from 'icons/Headphones'
import Alerts from 'icons/Alerts'
import {Dropdown, DropdownMenuItem, DropHr} from 'components/Dropdown'
import auth from 'utils/auth'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'

class TopNav extends Component {

  state = {
    dropdownOpen: false,
    notificationMenu: false
  }



  render() {
    let {handle, portraitUrl, user} = this.props
    return (
      <Bar>
          <Logo
            to={'/'}
          />
        <NavList>
          <NavLink
            to={(user.projects.edges.length > 0) ? `/${handle}/sessions/${user.projects.edges[0].node.title}` : `/${handle}/sessions`}
          >
            <Headphones/>
            <NavText>
              Sessions
            </NavText>
          </NavLink>
          <NavLink
            to={`/${handle}/projects`}
          >
            <Music
              height={18}
            />
            <NavText>
              Projects
            </NavText>
          </NavLink>
          <NavLink>
            <IconMenu
              iconButtonElement={(
                <IconButton>
                  <Alerts
                      alerts={(user.notifications.edges.length > 0)}
                  />
                </IconButton>
              )}
              value={this.state.notificationMenu}
              onChange={()=>{
                this.setState((prevState) => {
                  return {
                    notificationMenu: !prevState.notificationMenu
                  }
                })
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              {(user.notifications.edges.length > 0) ?
                user.notifications.edges.map(edge=>{
                  return (
                    <Notification
                      key={edge.node.id}
                      notification={edge.node}
                    />
                  )
                })
                :
                <MenuItem
                  secondaryText={"No notifications"}
                />
              }
              <MenuItem
                secondaryText={"View all notifications"}
              />
            </IconMenu>


          </NavLink>
          <Portrait
            src={portraitUrl}
            onClick={()=>{
              this.setState((prevState) => {
                if (!prevState.dropdownOpen){
                  return {
                    dropdownOpen: true
                  }
                }
              })
            }}
            onMouseOver={()=>{
              this.setState((prevState) => {
                if (!prevState.dropdownOpen){
                  return {
                    dropdownOpen: true
                  }
                }
              })
            }}
          />
          <Dropdown
            hide={(!this.state.dropdownOpen)}
            close={()=>{
              this.setState((prevState) => {
                if (prevState.dropdownOpen){
                  return {
                    dropdownOpen: false
                  }
                }
              })
            }}
          >
            <DropdownMenuItem
              text="View Profile"
              to={`/${handle}`}
            />
            <DropdownMenuItem
              text="My Tribe"
              to={`/${handle}/tribe`}
            />
            <DropHr/>
            <DropdownMenuItem
              text="Settings"
            />
            <DropdownMenuItem
              text="Help"
            />
            <DropHr/>
            <DropdownMenuItem
              text="Log Out"
              onClick={auth.logout}
            />
          </Dropdown>

          <BtFlatButton
            label={'New Project'}
            labelStyle={{
              color: white,
              fontSize: '13px',
              fontWeight: '400'
            }}
            backgroundColor={purple}
            to={`/${handle}/projects/new`}
            icon={<Plus/>}
            style={{borderRadius: '8px'}}
          />

        </NavList>

      </Bar>
    )
  }
}

export default TopNav
