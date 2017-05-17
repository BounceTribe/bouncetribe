import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import {MobileOnly} from 'styled'

class MobileNav extends Component {

  state = {
    drawer: false
  }

  toggle = () => {
    this.setState((prevState)=>{return {drawer: !prevState.drawer}})
  }

  render() {
    return (
      <MobileOnly>

        <AppBar
          title={"BounceTribe"}
          onLeftIconButtonTouchTap={this.toggle}
        >

        </AppBar>

        <Drawer
          open={this.state.drawer}
          onRequestChange={this.toggle}
          docked={false}
        >
          <MenuItem
            primaryText={"My Tribe"}
          />
          <Divider/>
          <MenuItem
            primaryText={"Feed"}
          />
          <MenuItem
            primaryText={"Sessions"}
          />
          <MenuItem
            primaryText={"Projects"}
          />
          <MenuItem
            primaryText={"Notifications"}
          />
          <Divider/>

          <MenuItem
            primaryText={"Settings"}
          />
          <MenuItem
            primaryText={"Help"}
          />
          <Divider/>

          <MenuItem
            primaryText={"Log Out"}
          />
        </Drawer>
      </MobileOnly>
    )
  }
}

export default MobileNav
