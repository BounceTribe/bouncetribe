import React, {Component} from 'react'
import Relay from 'react-relay'
import {Dialog, Checkbox, FlatButton, Toggle, TextField} from 'material-ui/'
import UpdateUser from 'mutations/UpdateUser'
import {BtFlatButton} from 'styled'
import {purple, white} from 'theme'
import changePassword from 'utils/changePassword'
import auth from 'utils/auth'



class UserSettings extends Component {

  constructor(props) {
    super(props)
    this.state = Object.assign((this.props.user || {}), {
      show: true,
      pass1: '',
      pass2: '',
      passwordError: '',
      hide: false
    })
  }

  sendUpdate() {
    let userId = this.props.user.id
    let updateObj = Object.assign({userId}, this.state)
    let newStatus = this.state.deactivated
    if (newStatus && newStatus!==this.props.user.deactivated) {
      //prevents showing other dialod before booting to login
      this.setState({hide: true})
    }
    Relay.Store.commitUpdate(
      new UpdateUser(updateObj),{
        onSuccess: res => {
          newStatus ? auth.logout() : this.props.onSave()
        },
        onFailure: res => {
          //handle failure
        }
      }
    )
  }

  submitPass = () => {
    if (!this.state.passwordError) {
      let query = {
        auth0UserId: this.props.user.auth0UserId,
        newPass: this.state.pass1
      }
      changePassword(query).then( result => {
        if (result.status===200) {
          this.props.onSave('password')
        } else {
          this.setState({ passwordError: 'Could not update password', })
        }
        console.log('CHANGE PASS RES:', result);
      })
    }
  }

  checkPasswords = ({pass1, pass2}) => {
    this.setState({pass1, pass2})
    console.log('this', this.state);
    let passwordError = ''
    if (pass1!==pass2) passwordError = `Password doesn't match!`
    else if ( pass1.length < 6) passwordError = 'Password too short!'

    this.setState({ passwordError })
  }

  render() {
    let user = this.props.user
    let emailPassword =
    <div>
      <h3>Email Notifications</h3>
      {/* <Checkbox
        label={"Disable all"}
        checked={this.state.doNotEmail}
        style={{padding: '10px 0'}}
        onCheck={(e, val) => this.setState({doNotEmail: val})}
      /> */}
      <Checkbox
        label={"Project Feedback"}
        checked={!this.state.doNotEmailPF}
        style={{padding: '10px 0'}}
        onCheck={(e, val) => this.setState({doNotEmailPF: !val})}
      />
      <Checkbox
        label={"Project Bounced"}
        checked={!this.state.doNotEmailPB}
        style={{padding: '10px 0'}}
        onCheck={(e, val) => this.setState({doNotEmailPB: !val})}
      />
      <Checkbox
        label={"Tribe Requests"}
        checked={!this.state.doNotEmailTR}
        style={{padding: '10px 0'}}
        onCheck={(e, val) => this.setState({doNotEmailTR : !val})}
      />
      <Checkbox
        label={"Tribe Request Accepted"}
        checked={!this.state.doNotEmailTA}
        style={{padding: '10px 0'}}
        onCheck={(e, val) => this.setState({doNotEmailTA: !val})}
      /><br />
      <TextField
        disabled={user.auth0UserId.includes('facebook|')}
        floatingLabelText={'New Password'}
        value={this.state.pass1}
        type={'password'}
        onChange={(e, pass1) => this.checkPasswords({pass1, pass2: this.state.pass2})}
      /><br />
      <TextField
        disabled={user.auth0UserId.includes('facebook|')}
        floatingLabelText={'Confirm Password'}
        errorText={this.state.passwordError}
        value={this.state.pass2}
        type={'password'}
        onChange={(e, pass2) => this.checkPasswords({pass1: this.state.pass1, pass2})}
      /><br />
      <BtFlatButton
        disabled={!this.state.pass1 || !!this.state.passwordError}
        label={'Submit'}
        backgroundColor={purple}
        labelStyle={{ color: white }}
        onClick={this.submitPass}
      /><br />
    </div>

    return (
      <Dialog
        title={"Settings"}
        autoScrollBodyContent
        modal
        bodyStyle={{minHeight: '220px'}}
        titleStyle={{ fontSize: '28px'}}
        open={this.props.open && !this.state.hide}
        actions={[
          <FlatButton
            label={"Cancel"}
            onClick={() => {
              this.props.onClose()
              this.setState({show: false, pass1: '', pass2: ''})
            }}
          />,
          <FlatButton
            label={"Save"}
            primary
            onClick={() => this.sendUpdate()}
          />
        ]}
      >
        {user.deactivated ?
          <h4 style={{paddingBottom: '50px'}}>
            Your BounceTribe account is currently deactivated
          </h4>
        : emailPassword}
        <Toggle
          label={user.deactivated ? "Activate Account" : "Active Account"}
          toggled={!this.state.deactivated}
          labelPosition={'right'}
          style={{fontSize: '18px', marginTop: '20px'}}
          onToggle={(e, val) => this.setState({deactivated: !val})}
        />

      </Dialog>
    )
  }
}

export default UserSettings
