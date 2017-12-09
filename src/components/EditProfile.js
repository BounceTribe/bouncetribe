import React, {Component} from 'react'
import Relay from 'react-relay'
import {handleValidator, isUniqueField} from 'utils/handles'
import UpdateUser from 'mutations/UpdateUser'
import {Dialog, TextField, FlatButton} from 'material-ui/'


export default class EditProfile extends Component {

  constructor(props) {
    super(props)
    this.state = Object.assign({...this.props.user}, {
      handleError: '',
      emailError: '',
      summaryError: ''
    })
  }

  handleSet = (val) => {
    let {handle: newHandle, error} = handleValidator(val)
    this.setState({ handle: newHandle, handleError: error })
    if (val!==this.props.user.handle) {
      isUniqueField(val, 'handle').then( result =>
        !result && this.setState({emailError: 'email already in use!'})
      )
    }
  }

  emailSet = (val) => {
    let error = ''
    this.setState({ email: val,  emailError: error })
    if (val!==this.props.user.email) {

      isUniqueField(val, 'email').then( result =>
        {
          console.log('in use', {val});
          !result && this.setState({emailError: 'email already in use!'})
        }
      )
    }
  }

  summarySet = (val) => {
    console.log('summary', val, val.length);
    let error = ''
    if (val.split(/\r\n|\r|\n/).length > 15) error='Too many lines'
    if (val.length > 400) error='500 character limit exceeded'
    this.setState({summary: val, summaryError: error})
  }

  setProfile = () => {
    let {handle, placename, summary, email, website} = this.state
    let {userId} = this.props
    Relay.Store.commitUpdate(
      new UpdateUser({ userId, handle, placename, summary, email, website }), {
        onSuccess: (success) => this.props.onSave(),
        onFailure: (failure) => console.log('updateuser fail', failure)
      }
    )
  }

  render() {
    let { handle,
          placename,
          summary,
          website,
          email,
          handleError,
          emailError,
          summaryError} = this.state
    return (
      <Dialog
        title={"Edit Profile"}
        modal
        autoScrollBodyContent
        open
        titleStyle={{ fontSize: '28px' }}
        actions={[
          <FlatButton
            label="Cancel"
            onClick={this.props.onClose}
          />,
          <FlatButton
            label="Submit"
            primary
            disabled={!!handleError || !!emailError || !!summaryError}
            onClick={this.setProfile}
          />
        ]}>
        <TextField
          floatingLabelText={'Handle'}
          errorText={handleError}
          value={handle}
          onChange={(e)=>this.handleSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Location'}
          value={placename}
          onChange={(e)=>this.setState({placename: e.target.value})}
        /><br />
        <TextField
          floatingLabelText={'Summary'}
          errorText={summaryError}
          value={summary}
          onChange={(e)=>this.summarySet(e.target.value)}
          multiLine
          rowsMax={5}
          fullWidth
        /><br />
        <TextField
          floatingLabelText={'Email'}
          errorText={emailError}
          value={email}
          onChange={(e)=>this.emailSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Website'}
          value={website}
          onChange={(e)=>this.setState({website: e.target.value})}
        />
      </Dialog>
    )
  }
}
