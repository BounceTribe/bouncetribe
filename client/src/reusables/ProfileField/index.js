import React, { Component } from 'react'
import styled from 'styled-components'
import {btWarn, btTeal} from 'styling/T'

const singleLine = (props) => {
  if (props.fontSize) {
    return props.fontSize
  } else {
    return 1
  }
}

const ProfileFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin: ${props => (props.fontSize) ? '5px 0px' : '30px 0px'};

  ${''/* &:after {
    content: "${props => props.label}";
    background-color: ${btTeal};
    position: relative;
    display: block;
    margin-left: 100%;
    top: -${props => props.fontSize}em;
    padding: 2px;
    visibility: hidden;
    opacity: 0;
    transition: all .25s;
  }

  &:hover:after {
    visibility: visible;
    opacity: 1;
  }*/}
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
  line-height: 1.15;
  font-style: ${props => (props.fontSize) ? 'normal' : 'italic'};
  font-size: ${props => singleLine(props)}em;
  height: 100%;
`


const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  border: ${props => (props.valid) ? btTeal : '2px solid '+btWarn };
  outline: none;
  font-style: ${props => (props.fontSize) ? 'normal' : 'italic'};
  font-size: ${props => singleLine(props)}em;
  line-height: 1.15;
  box-shadow: 0 0 10px ${btTeal};
`

const TextInput = styled.input`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  border: ${props => (props.valid) ? btTeal : '2px solid '+btWarn };
  outline: none;
  font-style: normal;
  font-size: ${props => singleLine(props)}em;
  line-height: 1.15;
  border-color: ${btTeal};
  box-shadow: 0 0 10px ${btTeal};
`

class ProfileField extends Component {

  state = {
    canEdit: false,
    text: this.props.text,
    valid: true
  }

  get inputOrDisplay() {
    const canEdit = this.state.canEdit
    if (canEdit && !this.props.fontSize) {
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
    } else if (canEdit && this.props.fontSize) {
      return (
        <TextInput
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
          fontSize={this.props.fontSize}
        />
      )
    } else {
      return (
        <ProfileFieldP
          fontSize={this.props.fontSize}
        >{this.props.text}</ProfileFieldP>
      )
    }
  }

  editText = (e) => {
    if (this.props.validate) {
      this.validator(e.target.value)
    }
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

  get showLabel() {
    if (this.props.fontSize) {
      return (
        null
      )
    } else {
      return (
        <ProfileFieldLabels>
          <ProfileFieldLabel>{this.props.label}</ProfileFieldLabel>
          <ProfileErrorMessage>{this.state.message}</ProfileErrorMessage>
        </ProfileFieldLabels>
      )
    }
  }

  render() {
    return (
      <ProfileFieldContainer
        onDoubleClick={this.doubleClickToEdit}
        fontSize={this.props.fontSize}
        label={this.props.label}
      >
        {this.showLabel}

        <ProfileFieldContents>
          {this.inputOrDisplay}
        </ProfileFieldContents>

      </ProfileFieldContainer>
    )
  }

}

export default ProfileField
