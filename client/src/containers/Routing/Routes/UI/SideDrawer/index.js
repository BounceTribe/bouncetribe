import React, {Component} from 'react'
import {Drawer} from 'material-ui'
import AuthContainer from './AuthContainer'

class SideDrawer extends Component {
  render() {
    return (
      <Drawer>
        <AuthContainer/>
      </Drawer>
    )
  }
}

export default SideDrawer
