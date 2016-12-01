import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopBar from './TopBar'
import {connect} from 'react-redux'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

class UI extends Component {
  render() {
    console.log(this.props.user)
    return (
      <MuiThemeProvider>
          <div>
            <TopBar
              user={this.props.user}
              isLoggedIn={this.props.isLoggedIn}
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
    user: state.auth.user,
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
