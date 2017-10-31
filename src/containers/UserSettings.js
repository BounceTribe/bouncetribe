import React, {Component} from 'react'
import Relay from 'react-relay'
import {Dialog, Checkbox, FlatButton, Toggle, TextField} from 'material-ui/'
import UpdateUser from 'mutations/UpdateUser'
import {BtFlatButton} from 'styled'
import {purple, white} from 'theme'



class UserSettings extends Component {

  constructor(props) {
    super(props)
    this.state = Object.assign(this.props.user, {
      show: true,
      pass1: null,
      pass2: null
    })
  }


  sendUpdate() {
    let userId = this.props.user.id
    let updateObj = Object.assign({userId}, this.state)
    console.log('updateObj', updateObj)
    Relay.Store.commitUpdate(
      new UpdateUser(updateObj),{
        onSuccess: res => {
          this.props.onSave()

        },
        onFailure: res => {
          //handle failure
        }
      }
    )
  }

  submitPass = () => {
    //TODO compare and notify
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
              this.setState({show: false})
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
        <Checkbox
          label={"Disable all"}
          checked={this.state.doNotEmail}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmail: val})}
        />
        <Checkbox
          label={"Tribe Requests"}
          checked={this.state.doNotEmailTR}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailTR : val})}
        />
        <Checkbox
          label={"Tribe Request Accepted"}
          checked={this.state.doNotEmailTRA}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailTRA: val})}
        />
        <Checkbox
          label={"Tribe Feedback Received"}
          checked={this.state.doNotEmailTFR}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailTFR: val})}
        />
        <Checkbox
          label={"Tribe Message Received"}
          checked={this.state.doNotEmailTMR}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailTMR: val})}
        />
        <Checkbox
          label={"Session Feedback Received"}
          checked={this.state.doNotEmailSFR}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailSFR: val})}
        />
        <Checkbox
          label={"Session Feedback Appreciated"}
          checked={this.state.doNotEmailSFA}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailSFA: val})}
        />
        <Checkbox
          label={"Session Message Received"}
          checked={this.state.doNotEmailSMR}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmailSMR: val})}
        />
        <br/>
        <TextField
          floatingLabelText={'New Password'}
          value={this.state.pass1}
          onChange={(e, val)=>this.setState({pass1: val})}
        />
        <TextField
          floatingLabelText={'Confirm Password'}
          value={this.state.pass1}
          onChange={(e, val)=>this.setState({pass2: val})}
        />
        <BtFlatButton
          label={'Add to Tribe'}
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
