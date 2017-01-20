import React, {Component} from 'react'
import Relay from 'react-relay'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {Main} from 'styled'
import 'theme/global.css'
import TopNav from 'components/TopNav'


injectTapEventPlugin()

class Template extends Component {

  get userOnly () {
    if (this.props.viewer.user) {
      return (
        <TopNav
          handle={this.props.viewer.user.handle}
        />
      )
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <Main>
          {this.userOnly}
          {this.props.children}
        </Main>

      </MuiThemeProvider>
    )
  }
}

export default Relay.createContainer(
  Template, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
        }
      `,
    },
  }
)
