import React, {Component} from 'react'
import TopBar from './TopBar'
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {btMedium, btPurple, btWhite, btLight} from 'styling/T'
import styled from 'styled-components'


injectTapEventPlugin()

const muiTheme = getMuiTheme({
  textField: {
    hintColor: btMedium,
    borderColor: btLight,
    focusColor: btPurple
  },
});

const Main = styled.main`
  margin-left: ${props=> props.feed ? 'auto' : '15%'};
  margin-right: ${props=> props.feed ? 'auto' : '15%'};
  margin-top: 60px;
  border: solid rgba(200, 200, 200, .9) .5px;
  padding: 60px;
  background-color: ${btWhite};
  box-shadow: 1px 1px rgba(160, 160, 160, .9);
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: ${props=> props.feed ? '50%' : null}; 
`

class UI extends Component {
  render() {
    let {
      isLoggedIn,
      router,
      children
    } = this.props
    console.log(router)
    return (
        <MuiThemeProvider
          muiTheme={muiTheme}
        >
          <div>
            <TopBar
              isLoggedIn={isLoggedIn}
              router={router}
            />
            <Main
              feed={(isLoggedIn && (router.location.pathname === '/')) ? true : false}
            >
              {children}
            </Main>
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
