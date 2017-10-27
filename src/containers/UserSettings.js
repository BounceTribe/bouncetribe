import React, {Component} from 'react'
import Relay from 'react-relay'
import {Dialog, Checkbox, FlatButton, Toggle} from 'material-ui/'
import UpdateUser from 'mutations/UpdateUser'



class UserSettings extends Component {

  constructor(props) {
    super(props)
    let {deactivated, doNotEmail} = this.props.user
    this.state = {
      show: true,
      deactivated,
      doNotEmail,
    }
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


  render() {
    return (
      <Dialog
        title={"Settings"}
        autoScrollBodyContent
        modal
        titleStyle={{ fontSize: '28px', fontFamily: 'Helvetica Neue' }}
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
          defaultChecked={this.state.doNotEmail}
          style={{padding: '10px 0'}}
          onCheck={(e, val) => this.setState({doNotEmail: val})}
        />
        <Toggle
          label={"Active Account"}
          defaultToggled={this.state.deactivated}
          labelPosition={'right'}
          style={{fontSize: '18px', marginTop: '10px'}}
          onToggle={(e, val) => this.setState({deactivated: val})}
        />
      </Dialog>
    )
  }
}

export default UserSettings
