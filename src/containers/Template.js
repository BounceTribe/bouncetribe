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
import UserSettings from 'containers/UserSettings'
import Snackbar from 'material-ui/Snackbar'


injectTapEventPlugin()

class Template extends Component {

  componentDidMount() {
    this.ping()
    let intervalId = setInterval(this.ping, 300000);
    this.setState({intervalId});
    console.log('template didmount', this.props);
    if (this.props.location.pathname==='/') this.redirect()
  }

  componentWillReceiveProps() {
    if (this.props.location.pathname==='/') this.redirect()
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  redirect = () => {
    let user = this.props.viewer.user
    let friends = user.friends.edges
    if (friends.length) {
      this.props.router.push(`/dash/${friends[0].node.handle}/projects`)
    } else {
      this.props.router.push(`/${user.handle}/profile`)
    }
  }

  ping = () => {
    let {user} = this.props.viewer
    if (user) {
      this.props.relay.commitUpdate(
        new SendPing({ user })
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

  settingsSave = () => {
    if (this.props.params.settings) {
      let s = this.props.location.pathname
      console.log('s', s, s.substr(0, s.lastIndexOf('/')))
      this.props.router.push(s.substr(0, s.lastIndexOf('/')))
    }
    // this.setState( {
    //     snackbarText: 'SETTINGS CHANGED',
    //     snackbar: open,
    //     settings: false
    //   })
  }

  settingsClose = () => {
    if (this.props.params.settings) {
      let s = this.props.location.pathname
      console.log('s', s, s.substr(0, s.lastIndexOf('/')))
      this.props.router.push(s.substr(0, s.lastIndexOf('/')))
    }
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={btTheme} >
        <Main>
          
          <UserSettings
            open={this.props.params.settings ? true : false}
            user={this.props.viewer.user}
            onSave={()=>this.settingsSave()}
            onClose={()=>this.settingsClose()}
          />
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
            auth0UserId
            handle
            deactivated
            portrait { url }
            doNotEmail
            doNotEmailTR
            doNotEmailTA
            doNotEmailPB
            doNotEmailPF
            friends (first: 1) {
              edges {
                node {
                  handle
                }
              }
            }
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
