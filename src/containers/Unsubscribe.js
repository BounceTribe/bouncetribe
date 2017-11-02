import React, {Component} from 'react'
import Relay from 'react-relay'
import UserSettings from 'containers/UserSettings'
import Snackbar from 'material-ui/Snackbar'
import {purple} from 'theme'

class Unsubscribe extends Component {

  state = {
    snackbar: false,
    snackbarText:''
  }

  render () {
    let {user} = this.props.viewer

    return (
      <div>
        <Snackbar
          open={this.state.snackbar ? true : false}
          message={this.state.snackbarText}
          autoHideDuration={2000}
          onRequestClose={()=>this.setState({snackbar: false})}
          onActionTouchTap={()=>this.setState({snackbar: false})}
          bodyStyle={{ backgroundColor: purple }}
        />
        <UserSettings
          open={this.state.settings}
          user={user}
          onSave={()=>this.settingsSave()}
          onClose={()=>this.settingsClose()}
        />
        <UserSettings
          open={true}
          user={user}
          onSave={()=>
            this.props.router.push(`/${user.handle}`)
          }
          onClose={()=>this.setState({settings: false})}
        />
      </div>
    )
  }
}

export default Relay.createContainer(
  Unsubscribe, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            auth0UserId
            handle
            deactivated
            doNotEmail
            doNotEmailTR
            doNotEmailTA
            doNotEmailPB
            doNotEmailPF
          }
        }
      `,
    },
  }
)
