import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopBar from './TopBar'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

class UI extends Component {
  render() {
    return (
      <MuiThemeProvider>
          <div>
            <TopBar/>
            <main>
              {this.props.children}
            </main>
          </div>
      </MuiThemeProvider>
    )
  }
}

export default UI
