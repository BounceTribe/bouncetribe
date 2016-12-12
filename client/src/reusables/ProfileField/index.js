import React, { Component } from 'react'
import styled from 'styled-components'


const ProfileFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px 0px;
`

const ProfileFieldLabel = styled.h3`
  font-weight: bold;
  margin-bottom: 10px;
`

const ProfileFieldContents = styled.div`
  width: 100%;
  min-height: 100px;
`

const ProfileFieldP = styled.p`
  width: 100%;
  min-height: 100px;
  line-height: 1.15;
  font-style: italic;
`


const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  border: none;
  outline: none;
  font-style: italic;
`


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
        <TextArea
          type="text"
          value={this.state.text}
          onChange={(e) => {
            this.editText(e)
          }}
          onBlur={(e)=>{
            console.log('blur')
            this.submitEdits()
          }}
        />
      )
    } else {
      return (
        <ProfileFieldP>{this.props.text}</ProfileFieldP>
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
    const {
      label,
    } = this.props
    return (
      <ProfileFieldContainer
        onDoubleClick={this.doubleClickToEdit}
      >
        <ProfileFieldLabel>{label}</ProfileFieldLabel>

        <ProfileFieldContents>
          {this.inputOrDisplay}
        </ProfileFieldContents>

      </ProfileFieldContainer>
    )
  }

}

export default ProfileField
