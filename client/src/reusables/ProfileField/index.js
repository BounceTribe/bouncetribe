import React, { Component } from 'react'
import styled from 'styled-components'
import {btWarn, btTeal, btPurple, btLight} from 'styling/T'
import EditIcon from 'imgs/edit'

const singleLine = (props) => {
  if (props.fontSize) {
    return props.fontSize
  } else {
    return 1
  }
}

const ProfileFieldContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.fontSize) ? 'row' : 'column'};
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin: ${props => (props.fontSize) ? '5px 0px' : '30px 0px'};

`

const ProfileFieldLabels = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 100%;
  cursor: pointer;
`

const ProfileFieldLabel = styled.h3`
  font-weight: bold;
`

const ProfileErrorMessage = styled.span`
  color: ${btWarn};
`

const ProfileFieldContents = styled.div`
  width: 100%;
  box-shadow: ${props=>(props.hover && !props.canEdit)? '0 0 5px '+ btTeal : 'none'};
`

const ProfileFieldP = styled.p`
  width: 100%;
  line-height: 1.15;
  font-style: ${props => (props.fontSize) ? 'normal' : 'italic'};
  font-size: ${props => singleLine(props)}em;
  height: 100%;
  cursor: pointer;
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
          onKeyPress={(e)=>{
            if (e.key === 'Enter' && !e.shiftKey) {
              this.submitEdits()
            }
          }}
          
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
          onKeyPress={(e)=>{
            if (e.key === 'Enter') {
              this.submitEdits()
            }
          }}
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

  startEditing = () => {
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

  iconClick = () => {
    if (!this.state.canEdit) {
      this.setState({
        canEdit: true,
      })
    } else {
      this.submitEdits()
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
          <ProfileFieldLabel
            onClick={this.iconClick}
          >
            {this.props.label}
            {this.normalIcon}
          </ProfileFieldLabel>
          <ProfileErrorMessage>{this.state.message}</ProfileErrorMessage>
        </ProfileFieldLabels>
      )
    }
  }

  handleMouseOver = () => {
    if(!this.state.hover) {
      this.setState({
        hover: true
      })
    }
  }

  handleMouseOut = () => {
    if(this.state.hover) {
      this.setState({
        hover: false
      })
    }
  }

  get fontSizeIcon () {
    if (this.props.fontSize) {
      return (
        <EditIcon
          height={'20px'}
          width={'20px'}
          fill={(this.state.hover) ? btPurple : btLight}
        />
      )
    }
  }

  get normalIcon () {
    if (!this.props.fontSize) {
      return (
        <EditIcon
          height={'20px'}
          width={'20px'}
          fill={(this.state.hover) ? btPurple : btLight}
        />
      )
    }
  }

  render() {
    return (
      <ProfileFieldContainer
        onDoubleClick={this.startEditing}
        fontSize={this.props.fontSize}
        label={this.props.label}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >

        {this.showLabel}

        <ProfileFieldContents
          hover={this.state.hover}
          canEdit={this.state.canEdit}
        >
          {this.inputOrDisplay}
        </ProfileFieldContents>

        {this.fontSizeIcon}

      </ProfileFieldContainer>
    )
  }

}

export default ProfileField
