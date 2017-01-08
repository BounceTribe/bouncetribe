import React, {Component} from 'react'
import TopBar from './TopBar'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {btMedium, btPurple, btWhite, btLight} from 'styling/T'
import styled from 'styled-components'
import Relay from 'react-relay'

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
  max-width: ${props=> props.feed ? '700px' : null};
`

class UI extends Component {
  render() {
    let {
      router,
      children,
      viewer
    } = this.props
    return (
        <MuiThemeProvider
          muiTheme={muiTheme}
        >
          <div>
            <TopBar
              router={router}
              viewer={viewer}
            />
            <Main
              feed={(viewer.user && (router.location.pathname === '/')) ? true : false}
            >
              {children}
            </Main>
          </div>
        </MuiThemeProvider>
    )
  }
}


export default Relay.createContainer(
  UI,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          id
          user {
            id
            email
            name
            handle
            profilePicUrl
            profilePicThumb
          }
        }
      `,
    },
  }
)
