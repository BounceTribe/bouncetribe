import React, {Component} from 'react'
import Relay from 'react-relay'
import {Bar, Logo, NavList, NavLink, Portrait, NavText, Notification, NotifyContainer, NotifyMessage, ViewAll} from 'styled/TopNav'
import {BtFlatButton} from 'styled'
import {white, purple} from 'theme'
import Plus from 'icons/Plus'
import Music from 'icons/Music'
import Alerts from 'icons/Alerts'
import {DropdownMenuItem, DropHr} from 'components/Dropdown'
import auth from 'utils/auth'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import UpdateNotification from 'mutations/UpdateNotification'

class TopNav extends Component {

  state = {
    dropdownOpen: false,
    notificationMenu: false,
    portraitMenu: false,
  }

  closeMenu = () => {
    //delay 200ms to allow menu item click to work
    setTimeout(()=>this.setState({
      portraitMenu: false,
      notificationMenu: false
    }), 200)
  }

  render() {
    let {portraitUrl, user} = this.props
    let {handle} = user
    let friendHandle = user.friends.edges.length ? user.friends.edges[0].node.handle : null

    return (
      <Bar>
        {/* <div onClick={()=>this.props.redirect()}> */}
          <Logo to={`/dash/${friendHandle ? friendHandle + '/projects' : '' }`} />
        {/* </div> */}
        <NavList>
          {/* <NavLink to={`/tribe/${handle}/find`} >
            <Headphones height={18} />
            <NavText>Find Your Mentor</NavText>
          </NavLink> */}
          {/* <NavLink
            to={((((user || {}).project || {}).edges || []).length > 0) ? `/sessions/${handle}/${user.projects.edges[0].node.title}` : `/sessions/${handle}`}
          >
            <Headphones />
            <NavText>Sessions</NavText>
          </NavLink> */}
          <NavLink to={`/projects/${handle}`}>
            <Music height={18} />
            <NavText>Projects</NavText>
          </NavLink>
          <NavLink style={{ paddingRight: 0, height: '19px' }} >
            <IconMenu
              iconButtonElement={(
                <IconButton style={{padding: 0}} >
                  <Alerts
                    alerts={ (((user || {}).notifications || {}).edges || []).filter(edge => !edge.node.checked).length }
                  />
                </IconButton>
              )}
              open={this.state.notificationMenu}
              onRequestChange={(open)=>{
                this.setState((prevState) =>
                  ({notificationMenu: !prevState.notificationMenu}))
                if (open) {
                  console.log('notif', user.notifications);
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
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              {((((user || {}).notifications || {}).edges || []).length > 0) ?
                user.notifications.edges.map(edge=>(
                  <Notification onClick={this.closeMenu} key={edge.node.id} notification={edge.node} />
                ) )
                :
                <NotifyContainer style={{border: 0}}>
                  <NotifyMessage>No new notifications</NotifyMessage>
                </NotifyContainer>
              }
              <ViewAll onClick={this.closeMenu} to={`/notifications`}>View All</ViewAll>
            </IconMenu>
          </NavLink>
          <IconMenu
            iconButtonElement={(
              <IconButton
                style={{ padding: 0, overflow: 'visible', margin: '0 15px' }}>
                <Portrait src={portraitUrl} />
              </IconButton>
            )}
            open={this.state.portraitMenu}
            onRequestChange={()=>{
              this.setState({portraitMenu: !this.state.portraitMenu})
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <DropdownMenuItem onClick={this.closeMenu} text="Dashboard"  to={`/`} />
            <DropdownMenuItem onClick={this.closeMenu} text="View Profile" to={`/${handle}`} />
            <DropdownMenuItem onClick={this.closeMenu} text="Tribe Members" to={`/tribe/${handle}`} />
            <DropHr/>
            <DropdownMenuItem onClick={() => {
              this.props.openSettings()
              this.closeMenu()
            } } text="Settings" />
            <DropdownMenuItem onClick={this.closeMenu} text="Help" href={"http://bouncetribe.com/support/"} />
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
              to={`/tribe/${handle}`}
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
            to={`projects/${handle}/new`}
            icon={<Plus/>}
            style={{borderRadius: '8px'}}
          />
        </NavList>
      </Bar>
    )
  }
}

export default TopNav
