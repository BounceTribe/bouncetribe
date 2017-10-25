import React, {Component} from 'react'
import Relay from 'react-relay'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {Main} from 'styled'
import 'theme/global.css'
import TopNav from 'components/TopNav'
import MobileNav from 'components/MobileNav'
import {btTheme} from 'theme'
import {url} from 'config'
import Footer from 'components/Footer'
import SendPing from 'mutations/SendPing'

injectTapEventPlugin()

class Template extends Component {

  componentDidMount() {
    this.ping()
    let intervalId = setInterval(this.ping, 300000);
    this.setState({intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  ping = () => {
    if (this.props.viewer.user) {
      this.props.relay.commitUpdate(
        new SendPing({
          user: this.props.viewer.user
        })
      )
    }
  }


  get userOnly () {
    let { user } = this.props.viewer
    if (user) {
      return (
        <TopNav
          handle={user.handle}
          user={user}
          portraitUrl={(user.portrait) ? user.portrait.url : `${url}/logo.png`}
        />
      )
    }
  }

  get mobileUserOnly () {
    let { user } = this.props.viewer
    if (user) {
      return (
        <MobileNav
          user={user}
          router={this.props.router}
          location={this.props.location}
        />
      )
    }
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={btTheme} >
        <Main>
          {this.userOnly}
          {this.mobileUserOnly}
          {this.props.children}
          <Footer/>
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
            portrait { url }
            doNotEmail
            notifications (
              first: 5
              orderBy: createdAt_DESC
            ) {
              edges {
                node {
                  id
                  type
                  checked
                  triggeredBy {
                    id
                    handle
                  }
                  notificationFor {
                    id
                    handle
                  }
                  createdAt
                  project {
                    id
                    title
                  }
                  session { id }
                }
              }
            }
          }
        }
      `,
    },
  }
)
