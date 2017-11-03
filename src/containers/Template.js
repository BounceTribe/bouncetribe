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
import {purple} from 'theme'


injectTapEventPlugin()

class Template extends Component {

  state = {
    snackbar: false,
    snackbarText: '',
    settings: false
  }

  componentDidMount() {
    this.ping()
    let intervalId = setInterval(this.ping, 300000);
    this.setState({intervalId});

    console.log('template didmount', this.props);
    let {settings} = this.props.params
    if (this.props.location.pathname==='/') this.redirect()
    settings && !this.state.settings && this.setState({settings: true})

  }

  componentWillReceiveProps(newProps) {
    let newPath = newProps.location.pathname
    if (newPath==='/') this.redirect()
    if (newPath===`/unsubscribe`) {
      this.setState({settings: true})
      this.redirect()
      console.log('UNSUB HIT');
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  redirect = () => {
    console.log('template redirect', this.props);
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
          user={user}
          openSettings={()=>this.setState({settings: true})}
          redirect={this.redirect}
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
          redirect={this.redirect}
          router={this.props.router}
          location={this.props.location}
        />
      )
    }
  }

  settingsSave = () => {
    // if (this.props.params.settings) {
    //   let s = this.props.location.pathname
    //   console.log('s', s, s.substr(0, s.lastIndexOf('/')))
    //   this.props.router.push(s.substr(0, s.lastIndexOf('/')))
    // }
    this.setState( {
        snackbarText: 'SETTINGS CHANGED',
        snackbar: true,
        settings: false
      })
  }

  settingsClose = () => {
    // if (this.props.params.settings) {
    //   let s = this.props.location.pathname
    //   console.log('s', s, s.substr(0, s.lastIndexOf('/')))
    //   this.props.router.push(s.substr(0, s.lastIndexOf('/')))
    // }
    this.setState({settings: false})
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={btTheme} >
        <Main>
          <Snackbar
            open={this.state.snackbar}
            message={this.state.snackbarText}
            autoHideDuration={2000}
            onRequestClose={()=>this.setState({snackbar: false})}
            onActionTouchTap={()=>this.setState({snackbar: false})}
            bodyStyle={{ backgroundColor: purple }}
          />
          <UserSettings
            open={this.state.settings ? true : false}
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
