import React, {Component} from 'react'
import Relay from 'react-relay'
import {Dialog, Checkbox, Button, Toggle} from 'material-ui'
import UpdateUser from 'mutations/UpdateUser'



class UserSettings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: true,
    }
  }

  sendUpdate(userData) {
    let userId = this.props.viewer.user.id
    let updateObj = Object.assign({userId}, userData)

    Relay.Store.commitUpdate(
      new UpdateUser(updateObj),{
        onSuccess: res => {
        this.setState({show: false})
      } }
    )
  }

  render() {
    let userCopy = {...this.this.props.viewer.user}
    let {doNotEmail, isActive} = userCopy
    return (
      <Dialog
        title={"Settings"}
        actions={[
          <Button
            label={"Cancel"}
            onClick={() => this.setState({show: false})}
          />,
          <Button
            label={"Save"}
            primary
            onClick={() => this.sendUpdate(userCopy)}
          />
        ]}
        open={this.state.show}
        modal={true} >
        <h3>Email Notifications</h3>
        <Checkbox
          label={"Disable all"}
          checked={doNotEmail}
        />
        <h3>Email Notifications</h3>
        <Toggle
          label={"Active Account"}
          toggled={isActive}
        />
      </Dialog>
    )

  }
}

export default Relay.createContainer( UserSettings, {
   fragments: { viewer: () => Relay.QL`
       fragment on Viewer {
         user {
           id
           handle
           score
           isActive
           doNotEmail
         }
       }
     `,
   },
 }
)
