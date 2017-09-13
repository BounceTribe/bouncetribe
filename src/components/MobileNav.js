import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import {MobileOnly} from 'styled'
import {purple, black} from 'theme'
import IconButton from 'material-ui/IconButton'
import NavigationIcon from 'material-ui/svg-icons/navigation/menu'
import HomeIcon from 'material-ui/svg-icons/action/home'
import Notifications from 'material-ui/svg-icons/social/notifications'
import Help from 'material-ui/svg-icons/action/help'
import auth from 'utils/auth'
import Tribe from 'icons/Tribe'
import Headphones from 'icons/Headphones'
import Music from 'icons/Music'
import Settings from 'icons/Settings'
import styled from 'styled-components'
import {BtLink} from 'styled'

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 15px;
`

const Portrait = styled.img`
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 60px;
  margin-right: 10px;
`

const Handle = styled(BtLink)`
  color: ${black}
`

class MobileNav extends Component {

  state = {
    drawer: false
  }

  toggle = () => {
    this.setState((prevState)=>{return {drawer: !prevState.drawer}})
  }

  render() {
    let {router, user} = this.props
    return (
      <MobileOnly>

        <AppBar
          title={"BounceTribe"}
          onLeftIconButtonTouchTap={this.toggle}
          iconElementLeft={(
            <IconButton>
              <NavigationIcon
                color={purple}
              />
            </IconButton>
          )}
        >

        </AppBar>

        <Drawer
          open={this.state.drawer}
          onRequestChange={this.toggle}
          docked={false}
        >
          <Row>
            <Portrait
              src={user.portrait.url}
            />
            <Handle
              to={`/${user.handle}`}
            >
              {user.handle}
            </Handle>
          </Row>

          <MenuItem
            primaryText={"My Tribe"}
            leftIcon={(
              <Tribe
                fill={purple}
              />
            )}
            onTouchTap={()=>{
              router.push(`/${user.handle}/tribe`)
            }}
          />
          <Divider/>
          <MenuItem
            primaryText={"Feed"}
            leftIcon={(
              <HomeIcon
                color={purple}
              />
            )}
            onTouchTap={()=>{
              router.push(`/`)
            }}
          />
          <MenuItem
            primaryText={"Sessions"}
            leftIcon={(
              <Headphones
                fill={purple}
              />
            )}
            onTouchTap={()=>{
              router.push((user.projects.edges.length > 0) ? `/${user.handle}/sessions/${user.projects.edges[0].node.title}` : `/${user.handle}/sessions`)
            }}
          />
          <MenuItem
            primaryText={"Projects"}
            leftIcon={(
              <Music
                fill={purple}
              />
            )}
            onTouchTap={()=>{
              router.push(`/${user.handle}/tribe`)
            }}
          />
          <MenuItem
            primaryText={"Notifications"}
            leftIcon={(
              <Notifications
                color={purple}
              />
            )}
            onTouchTap={()=>{
              router.push(`/${user.handle}/notifications`)
            }}
          />
          <Divider/>

          <MenuItem
            primaryText={"Settings"}
            leftIcon={(
              <Settings/>
            )}
            onTouchTap={()=>{
              router.push(`/${user.handle}/notifications`)
            }}
          />
          <MenuItem
            primaryText={"Help"}
            leftIcon={(
              <Help/>
            )}
          />
          <Divider/>

          <MenuItem
            primaryText={"Log Out"}
            leftIcon={(<div/>)}
            onTouchTap={auth.logout}
          />
        </Drawer>
      </MobileOnly>
    )
  }
}

export default MobileNav
