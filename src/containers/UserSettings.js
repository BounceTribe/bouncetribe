import React, {Component} from 'react'
import Relay from 'react-relay'
import {Dialog, Checkbox, FlatButton, Toggle, TextField} from 'material-ui/'
import UpdateUser from 'mutations/UpdateUser'
import {BtFlatButton} from 'styled'
import {purple, white} from 'theme'
// import {updatePassword, getCredToken} from 'utils/updatePassword'
import changePassword from 'utils/changePassword'
import {auth0} from 'config'



class UserSettings extends Component {

  constructor(props) {
    super(props)
    this.state = Object.assign((this.props.user || {}), {
      show: true,
      pass1: '',
      pass2: '',
      passwordError: '',
    })
  }


  sendUpdate() {
    let userId = this.props.user.id
    let updateObj = Object.assign({userId}, this.state)
    console.log('usdateobj', updateObj);
    Relay.Store.commitUpdate(
      new UpdateUser(updateObj),{
        onSuccess: res => {this.props.onSave()},
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

      // return new Promise( (resolve, reject) => {
      //   this.setNewPassword(this.state.auth0UserId, this.state.pass1, auth.getToken())
      //   .then(res => {
      //     console.log('response:', res);
      //     return resolve(res)
      //   })
      // })
    }
  }



  // setNewPassword = (auth0UserId, password, idToken) => {
  //   console.log('updatePassword', auth0UserId, password, idToken);
  //   let url = `https://${auth0.domain}/api/v2/users/${auth0UserId}`
  //
  //   let options = {
  //     method: 'PATCH',
  //     headers: { 'content-type': 'application/json' },
  //     body: {
  //       password,
  //       Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
  //       connection: 'Username-Password-Authentication'
  //     },
  //     // params: {
  //     //   scope: 'update.us',
  //     //   state: 'default'
  //     // }
  //     // idToken: auth.getToken()
  //   }
  //
  //   return new Promise( (resolve, reject) => {
  //     fetch(url, options)
  //     .then(result => result.json())
  //     .then(response => {
  //       resolve(response)
  //     })
  //   })
  // }



  checkPasswords = ({pass1, pass2}) => {
    this.setState({pass1, pass2})

    let passwordError = pass1!==pass2 ? `Password doesn't match!` : ''
    if (!passwordError && (pass1.length < 6)) {
      passwordError = 'Password too short!'
    }
    this.setState({ passwordError })
  }
  render() {
    return (
      <Dialog
        title={"Settings"}
        autoScrollBodyContent
        modal
        titleStyle={{ fontSize: '28px'}}
        open={this.props.open}
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
        />
        <br />
        <TextField
          disabled={this.props.user.auth0UserId.includes('facebook|')}
          floatingLabelText={'New Password'}
          value={this.state.pass1}
          type={'password'}
          onChange={(e, pass1) => this.checkPasswords({pass1, pass2: this.state.pass2})}
        />
        <br />
        <TextField
          disabled={this.props.user.auth0UserId.includes('facebook|')}
          floatingLabelText={'Confirm Password'}
          errorText={this.state.passwordError}
          value={this.state.pass2}
          type={'password'}
          onChange={(e, pass2) => this.checkPasswords({pass1: this.state.pass1, pass2})}
        /><br />
        {console.log(!this.state.pass1 || !!this.state.passwordError, !this.state.pass1, !!this.state.passwordError)}
        <BtFlatButton
          disabled={!this.state.pass1 || !!this.state.passwordError}
          label={'Submit'}
          backgroundColor={purple}
          labelStyle={{ color: white }}
          onClick={this.submitPass}
        />
        <br />
        <Toggle
          label={"Active Account"}
          toggled={!this.state.deactivated}
          labelPosition={'right'}
          style={{fontSize: '18px', marginTop: '10px'}}
          onToggle={(e, val) => this.setState({deactivated: !val})}
        />
      </Dialog>
    )
  }
}

export default UserSettings
