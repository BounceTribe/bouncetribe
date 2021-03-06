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
import {acceptFriendRequest} from 'utils/updateCommits'
import {doNotPing} from 'utils/isOnline'
// import {mapNodes} from 'utils/mapNodes'

injectTapEventPlugin()

class Template extends Component {

  constructor(props) {
    super(props)
    this.pathCheck(this.props)
    this.ping()
    let intervalId = setInterval(this.ping, 300000)

    this.state = {
      snackbarText: '',
      settings: false,
      intervalId
    }
    console.log('template constructor', this.props)
    // this.fileUtil()
  }

  // fileUtil = () => {
  //   let files = mapNodes(this.props.viewer.allFiles)
  //   let filtered = files.filter(f=>{
  //     return f.portraitOwner && !f.portraitSmallOwner
  //   })
  //   console.log({filtered});
  // }

  componentWillReceiveProps(newProps) {
    let oldPath = this.props.location.pathname
    let newPath = newProps.location.pathname
    if (oldPath!==newPath) this.pathCheck(newProps)
  }

  componentWillUnmount() { clearInterval(this.state.intervalId) }

  pathCheck = (props) => {
    let newPath = props.location.pathname
    let {inviteId, newFriendId} = props.params
    // console.log('pathcheck', props, newPath)
    switch (true) {
      case newPath==='/':
        this.redirect()
        break
      case newPath==='/dash/':
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

  acceptRequest = (requestId, newFriendId) => acceptFriendRequest({
    requestId, newFriendId,
    props: this.props,
    successCB: (res)=>{
      this.setState({snackbarText: 'FRIEND ADDED'})
      this.props.router.push(`/tribe/${this.props.viewer.user.handle}/`)
    },
    failureCB: (res)=>{
      console.log('add friend failure', res)
      this.redirect()
    }
  })

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
                location.assign(`${url}/dash/feed/${this.props.viewer.user.handle}/1`)
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
    this.props.router.push(`${ user ? `/dash/feed/${user.handle}/` : '/login/' }`)
  }

  ping = () => {
    let {user} = this.props.viewer
    if (user && !doNotPing(user)) {
      this.props.relay.commitUpdate( new SendPing({ user }), {
        // onSuccess: success => console.log('ping res', success )
      } )
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
          portraitUrl={(user.portraitMini || {}).url || `${url}/logo.png`}
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
          {user && (this.state.settings || user.deactivated) &&
            <UserSettings
              open //open conditions here ^^ to prevent unnecessary rendering
              user={user}
              router={this.props.router}
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

export default Relay.createContainer( Template, {
  initialVariables: { userHandle: '' },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            mentorAccount {id}
            auth0UserId
            handle
            deactivated
            portrait { url }
            portraitSmall { url }
            portraitMini { url }
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
          # allFiles (
          #   orderBy:createdAt_ASC
          #   first:300
          # ) {
          #   edges {
          #     node {
          #       artworkProject {id}
          #       artworkProjectSmall {id}
          #       contentType
          #       createdAt
          #       id
          #       name
          #       pictureOwner {id}
          #       portraitMiniOwner {id}
          #       portraitOwner {id}
          #       portraitSmallOwner {id}
          #       secret
          #       size
          #       trackProject {id}
          #       updatedAt
          #       uploader {id}
          #       url
          #     }
          #   }
          # }
        }
      `,
    },
  }
)
