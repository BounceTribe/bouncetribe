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
import AddToFriends from 'mutations/AddToFriends'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import UpdateFriendRequest from 'mutations/UpdateFriendRequest'

injectTapEventPlugin()

class Template extends Component {

  state = {
    snackbarText: '',
    settings: false
  }

  componentDidMount() {
    this.ping()
    let intervalId = setInterval(this.ping, 300000)
    this.setState({
      intervalId
    })
    console.log('template didmount', this.props)
    this.pathCheck(this.props)
  }

  componentWillReceiveProps(newProps) {
    let oldPath = this.props.location.pathname
    let newPath = newProps.location.pathname
    if (oldPath!==newPath) this.pathCheck(newProps)
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  pathCheck = (props) => {
    let newPath = props.location.pathname
    let {inviteId, newFriendId} = props.params
    // console.log('pathcheck', props, newPath)
    switch (true) {
      case newPath==='/':
        this.redirect()
        break
      case newPath==='/unsubscribe':
        this.setState({settings: true})
        this.redirect()
        break
      case newPath.substr(0,15)==='/acceptrequest/':
        console.log('inviteId', inviteId)
        this.acceptRequest(inviteId, newFriendId)
        break
      case newPath.substr(0,14)==='/acceptinvite/':
        console.log('newFriendId', newFriendId);
        this.addInviteFriend(newFriendId)
        break
      default:
    }
  }

  acceptRequest = (inviteId, newFriendId) => {
    console.log('accept', inviteId);
    let {id: selfId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new UpdateFriendRequest({ id: inviteId, accepted: true }), {
        onSuccess: (res) => {
          this.props.relay.commitUpdate(
            new AddToFriends({ selfId, newFriendId }), {
              onSuccess: res => {
                console.log('friend added res', res);
                this.setState({snackbarText: 'FRIEND ADDED'})
                this.props.router.push(`/tribe/${this.props.viewer.user.handle}`)
              },
              onFailure: (res) => {
                console.log('add friend failure', res)
                this.redirect()
              }
            }
          )
        },
        onFailure: (res) => {
          console.log('add  update req failure', res)
          this.redirect()
        }
      }
    )
  }
  //sublime id: acceptinvite/cj5jwswj4cjyx0161fik5z7pv

  addInviteFriend = (newFriendId) => {
    let selfId = this.props.viewer.user.id
    let actorId = newFriendId
    let recipientId = selfId
    //TODO, prevent anyone from using this route
    this.props.relay.commitUpdate(
      new CreateFriendRequest({ actorId, recipientId, accepted: true}), {
        onSuccess: res => {
          this.props.relay.commitUpdate(
            new AddToFriends({ selfId, newFriendId }), {
              onSuccess: res => {
                console.log('friend added res', res);
                this.setState({snackbarText: 'FRIEND ADDED'})
                //using location fo force query update
                location.assign(`${url}/dash/`)
              },
              onFailure: res => {
                console.log('ADD FRIEND FAILURE', res)
                this.redirect()
              }
            }
          )
        },
        onFailure: res => {
          console.log('CFRQ FAIL', res)
          this.redirect()
        }
      }
    )
  }

  redirect = () => {
    console.log('template redirect', this.props)
    let user = this.props.viewer.user
    this.props.router.push(`${ user ? '/dash/' : '/login/' }`)
  }

  ping = () => {
    let {user} = this.props.viewer
    if (user) {
      this.props.relay.commitUpdate( new SendPing({ user }) )
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

  settingsSave = (passSave) => {
    this.setState( {
        snackbarText: passSave ? 'PASSWORD CHANGED' : 'SETTINGS CHANGED',
        settings: passSave ? true : false
    } )
  }

  settingsClose = () => {
    this.setState({settings: false})
  }

  render () {
    let user = this.props.viewer.user
    return (
      <MuiThemeProvider muiTheme={btTheme} >
        <Main>
          <Snackbar
            open={this.state.snackbarText ? true : false}
            message={this.state.snackbarText}
            autoHideDuration={2000}
            onRequestClose={()=>this.setState({snackbarText: ''})}
            onActionTouchTap={()=>this.setState({snackbarText: ''})}
            bodyStyle={{ backgroundColor: purple }}
          />
          {user &&
            <UserSettings
              open={(this.state.settings || user.deactivated) ? true : false}
              user={user}
              onSave={this.settingsSave}
              onClose={()=>this.settingsClose()}
            />
          }
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
            friends (
              first: 1
              filter: {deactivated: false}
            ) {
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
