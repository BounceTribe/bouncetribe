import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SideDrawer from './SideDrawer'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

class UI extends Component {
  render() {
    return (
      <MuiThemeProvider>
          <div>
            <SideDrawer/>
            <header>
              <h1>Carl Sitez</h1>
            </header>
            <main>
              {this.props.children}
            </main>
          </div>
      </MuiThemeProvider>
    )
  }
}

export default UI
