import React, { Component } from 'react'

class ProfileField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canEdit: false,
      text: this.props.text,
    }
  }


  get inputOrDisplay() {
    const canEdit = this.state.canEdit
    if (canEdit) {
      return (
        <input
          type="text"
          value={this.state.text}
          onChange={(e) => {
            this.editText(e)
          }}
          onBlur={(e)=>{
            this.submitEdits()
          }}
        />
      )
    } else {
      return (
        <h5>{this.props.text}</h5>
      )
    }
  }

  editText = (e) => {
    this.setState({
      text: e.target.value
    })
  }

  doubleClickToEdit = () => {
    this.setState({
      canEdit: true
    })
  }

  submitEdits = () => {
    this.setState({
      canEdit: false
    })
    let submission = {}
    submission[this.props.field] = this.state.text
    this.props.submitField(submission)
  }

  render() {
    return (
      <div
        style={{
          margin: '20px',
          border: 'solid 5px purple'
        }}
        onDoubleClick={this.doubleClickToEdit}
      >
        {this.inputOrDisplay}
      </div>
    )
  }

}

export default ProfileField
