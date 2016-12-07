import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopBar from './TopBar'
import {connect} from 'react-redux'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

class UI extends Component {
  render() {
    return (
      <MuiThemeProvider>
          <div>
            <TopBar
              isLoggedIn={this.props.isLoggedIn}
              router={this.props.router}
              viewer={this.props.viewer}
            />
            <main>
              {this.props.children}
            </main>
          </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth['id_token'],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

UI = connect(
  mapStateToProps,
  mapDispatchToProps
)(UI)

export default UI
