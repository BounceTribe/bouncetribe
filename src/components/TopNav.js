import React, {Component} from 'react'
import Relay from 'react-relay'
import {Bar, Logo, NavList, NavLink, Portrait, NavText, Notification, NotifyContainer, NotifyMessage, ViewAll} from 'styled/TopNav'
import {BtFlatButton, Button} from 'styled'
import {white, purple} from 'theme'
import Plus from 'icons/Plus'
import Music from 'icons/Music'
import Headphones from 'icons/Headphones'
import Alerts from 'icons/Alerts'
import {DropdownMenuItem, DropHr} from 'components/Dropdown'
import auth from 'utils/auth'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import UpdateNotification from 'mutations/UpdateNotification'
import Dialog from 'material-ui/Dialog'
import Checkbox from 'material-ui/Checkbox'
// import {Container} from 'styled/list'


import UpdateUser from 'mutations/UpdateUser'

class TopNav extends Component {
  state = {
    dropdownOpen: false,
    notificationMenu: false,
    portraitMenu: false,
    settings: false
  }

  render() {
    let {handle, portraitUrl, user} = this.props
    return (
      <Bar>
        <Dialog
          title={"Settings"}
          actions={[
            <Button
              label={"Close"}
              onClick={() => this.setState({settings: false})}
            />
          ]}
          open={this.state.settings}
          modal={true}
        >
          <h3>Email Notifications</h3>
          <Checkbox
            label={"Disable all"}
            checked={user.doNotEmail}
            onCheck={(e, isChecked) => {
              Relay.Store.commitUpdate(
                new UpdateUser({
                  userId: user.id,
                  doNotEmail: isChecked
                })
              )
            }}
          />
        </Dialog>
        <Logo to={'/'} />
        <NavList>
          <NavLink
            to={`/${handle}/TribeFind`}
          >
            <Headphones
              height={18}
            />
            <NavText>
              Find Your Mentor
            </NavText>
          </NavLink>
          <NavLink
            to={((((user || {}).project || {}).edges || []).length > 0) ? `/${handle}/sessions/${user.projects.edges[0].node.title}` : `/${handle}/sessions`}
          >
            <Headphones />
            <NavText>Sessions</NavText>
          </NavLink>
          <NavLink to={`/${handle}/projects`}>
            <Music height={18} />
            <NavText>Projects</NavText>
          </NavLink>
          <NavLink
            style={{
              paddingRight: 0,
              height: '19px'
            }}
          >
            <IconMenu
              iconButtonElement={(
                <IconButton style={{padding: 0}} >
                  <Alerts
                    alerts={ (((user || {}).notifications || {}).edges || []).filter(edge => !edge.node.checked).length }
                  />
                </IconButton>
              )}
              open={this.state.notificationMenu}
              onRequestChange={()=>{
                if (!this.state.notificationMenu) {
                  user.notifications.edges.forEach( (edge) => {
                    if (!edge.node.checked) {
                      Relay.Store.commitUpdate(
                        new UpdateNotification({
                          id: edge.node.id,
                          checked: true
                        })
                      )
                    }
                  })
                }
                this.setState((prevState) =>
                    ({notificationMenu: !prevState.notificationMenu})
                )
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <ViewAll to={`/${handle}/notificationPage`}>View All</ViewAll>
              {((((user || {}).notifications || {}).edges || []).length > 0) ?
                user.notifications.edges.map(edge=>(
                  <Notification key={edge.node.id} notification={edge.node} />
                ) )
                :
                <NotifyContainer style={{border: 0}}>
                  <NotifyMessage>No new notifications</NotifyMessage>
                </NotifyContainer>
              }
            </IconMenu>


          </NavLink>
          <IconMenu
            iconButtonElement={(
              <IconButton
                style={{
                  padding: 0,
                  overflow: 'visible',
                  margin: '0 15px'
                }}
              >
                <Portrait src={portraitUrl} />
              </IconButton>
            )}
            open={this.state.portraitMenu}
            onRequestChange={()=>{
              this.setState((prevState) => (
                {portraitMenu: !prevState.portraitMenu}
              ) )
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <DropdownMenuItem text="Home" to={`/`} />
            <DropdownMenuItem text="View Profile" to={`/${handle}`} />
            <DropdownMenuItem text="My Tribe" to={`/${handle}/tribe`} />
            <DropHr/>
            <DropdownMenuItem text="Settings"
              onClick={()=>{ this.setState({settings: true}) }} />
            <DropdownMenuItem text="Help"
              href={"http://bouncetribe.com/support/"}
            />
            <DropHr/>
            <DropdownMenuItem text="Log Out" onClick={auth.logout} />
          </IconMenu>
          {/*
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
            }} />

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
          </Dropdown> */}

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
