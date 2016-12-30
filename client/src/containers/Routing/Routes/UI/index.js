import React, {Component} from 'react'
import TopBar from './TopBar'
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {btTeal, btPurple} from 'styling/T'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  textField: {
    hintColor: btTeal,
    borderColor: btTeal,
    focusColor: btPurple
  },
});


class UI extends Component {
  render() {
    return (
        <MuiThemeProvider
          muiTheme={muiTheme}
        >
          <div>
            <TopBar
              isLoggedIn={this.props.isLoggedIn}
              router={this.props.router}
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
