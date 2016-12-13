import React, { Component } from 'react'
import styled from 'styled-components'
import {btWarn} from 'styling/T'

const ProfileFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px 0px;
`

const ProfileFieldLabels = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 100%;
`

const ProfileFieldLabel = styled.h3`
  font-weight: bold;
`

const ProfileErrorMessage = styled.span`
  color: ${btWarn};
`

const ProfileFieldContents = styled.div`
  width: 100%;
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
  border: ${props => (props.valid) ? 'none' : '2px solid red' };
  outline: none;
  font-style: italic;
`


class ProfileField extends Component {

  state = {
    canEdit: false,
    text: this.props.text,
    valid: true
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
          valid={this.state.valid}
        />
      )
    } else {
      return (
        <ProfileFieldP>{this.props.text}</ProfileFieldP>
      )
    }
  }

  editText = (e) => {
    this.validator(e.target.value)
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

    if (this.state.valid) {
      this.setState({
        canEdit: false
      })
      let submission = {}
      submission[this.props.field] = this.state.text
      this.props.submitField(submission)
    }
  }

  validator = (input) => {
    let result = this.props.validate(input)
    if (!result.valid) {
      this.setState({
        valid: result.valid,
        message: result.message
      })
    } else {
      this.setState({
        valid: result.valid,
        message: ''
      })
    }
  }

  render() {
    const {
      label,
    } = this.props
    return (
      <ProfileFieldContainer
        onDoubleClick={this.doubleClickToEdit}
      >
        <ProfileFieldLabels>
          <ProfileFieldLabel>{label}</ProfileFieldLabel>
          <ProfileErrorMessage>{this.state.message}</ProfileErrorMessage>
        </ProfileFieldLabels>

        <ProfileFieldContents>
          {this.inputOrDisplay}
        </ProfileFieldContents>

      </ProfileFieldContainer>
    )
  }

}

export default ProfileField
