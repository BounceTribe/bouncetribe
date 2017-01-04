import React, { Component } from 'react'
import styled from 'styled-components'
import {btWarn, btTeal, btPurple, btLight, btBlack, btDark} from 'styling/T'
import EditIcon from 'imgs/icons/edit'


const singleLine = (props) => {
  if (props.fontSize) {
    return props.fontSize
  } else {
    return .9
  }
}

const ProfileFieldContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.fontSize) ? 'row' : 'column'};
  align-content: flex-start;
  justify-content: flex-start;
  align-items: center;
  margin: ${props => (props.fontSize) ? '5px 0px' : '0 0 30px 0'};
  width: 90%;
`

const ProfileFieldLabels = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  cursor: ${props => (props.ownProfile) ? 'pointer' : 'default'};
`

const ProfileFieldLabel = styled.h3`
  font-weight: bold;
  display: flex;
  align-items: center;
`

const ProfileErrorMessage = styled.span`
  color: ${btWarn};
  font-size: ${props=>props.fontSize ? '.2em' : 'inherit'};
  max-width: ${props=>props.fontSize ? '20%' : null}
`

const ProfileFieldContents = styled.div`
  transition: all .2s;
  width: ${props => (props.fontSize) ? 'auto' : '100%'};
  min-height: ${props => (props.fontSize) ? 'auto' : '50px'};
  margin-right: ${props => (props.fontSize) ? '2px' : null};
`

const ProfileFieldP = styled.p`
  line-height: 1.15;
  font-style: normal;
  font-size: ${props => singleLine(props)}em;
  height: 100%;
  cursor: ${props => (props.ownProfile) ? 'pointer' : 'default'};
  color: ${props => (props.text) ? btBlack : btLight};
  margin-right: 5px;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  border: ${props => (props.valid) ? btTeal : '2px solid '+btWarn };
  outline: none;
  font-size: ${props => singleLine(props)}em;
  line-height: 1.15;
  color: ${btDark};

  &:focus {
    box-shadow: 0 0 10px ${btTeal};
  }
`

const TextInput = styled.input`
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  outline: none;
  font-style: normal;
  font-size: ${props => singleLine(props)}em;
  line-height: 1.15;
  color: ${btDark};
  border: ${props => (props.valid) ? btTeal : '2px solid '+btWarn };
  min-width: 100px;
  transition: all .25s;

  &:focus {
    box-shadow: 0 0 10px ${btTeal};

  }
`

const IconContainer = styled.div`
  display: flex;
  margin-right: 5px;
`

class ProfileField extends Component {

  state = {
    canEdit: false,
    text: this.props.text || '',
    valid: true
  }

  componentDidMount () {
    if (this.props.text) {
      this.setState({
        displayText: this.prepareLinebreaks(this.props.text)
      })
    } else {
      this.setState({
        displayText: `add your ${this.props.label}`
      })
    }

  }

  componentWillReceiveProps (newProps) {
    if (newProps.text) {
      this.setState({
        text: newProps.text || '',
        displayText: newProps.text ? this.prepareLinebreaks(newProps.text) : `add your ${this.props.label}`,
      })
    }
  }

  prepareLinebreaks = (text) => {
    let displayText = text.replace(/^"(.+(?="$))"$/, '$1')
    displayText = displayText.replace(/\r?\n/g, '<br />')
    return displayText
  }

  get inputOrDisplay() {
      if (!this.props.fontSize && this.props.ownProfile) {
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
          id={this.props.label}
        />
      )
    } else if (this.props.fontSize && this.props.ownProfile) {
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
          message={this.state.message}
          size={(this.state.text) ? this.state.text.length : 10}
          id={this.props.label}

        />
      )
    } else {
      return (
        <ProfileFieldP
          fontSize={this.props.fontSize}
          ownProfile={this.props.ownProfile}
          text={this.props.text}
        >{this.state.displayText}</ProfileFieldP>
      )
    }
  }

  editText = (e) => {
    if (this.props.ownProfile) {
      if (this.props.validate) {
        this.validator(e.target.value)
      }
      this.setState({
        text: e.target.value,
        displayText: e.target.value
      })
    }
  }

  startEditing = () => {
    if (this.props.ownProfile) {
      this.setState({
        canEdit: true
      })
    }
  }

  submitEdits = () => {

    if (this.state.valid && this.props.ownProfile) {
      this.setState({
        canEdit: false
      })
      let submission = {}
      submission[this.props.field] = this.state.text
      this.props.submitField(submission)
      document.getElementById(this.props.label).blur()
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
    if (!this.state.canEdit && this.props.ownProfile) {
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
        <ProfileFieldLabels
          ownProfile={this.props.ownProfile}
        >
          <ProfileFieldLabel
            onClick={this.iconClick}
          >
            {this.props.label.charAt(0).toUpperCase() + this.props.label.slice(1)}
            {this.normalEditIcon}
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

  get fontSizeEditIcon () {
    if (this.props.fontSize && this.props.ownProfile && this.props.text) {
      return (
        <EditIcon
          fill={(this.state.hover) ? btPurple : 'rgba(160,160,160, .5)'}
        />
      )
    }
  }

  get normalEditIcon () {
    if (!this.props.fontSize && this.props.ownProfile) {
      return (
        <EditIcon
          fill={(this.state.hover) ? btPurple : 'rgba(160,160,160, .5)'}
        />
      )
    }
  }

  get showIcon () {
    if (this.props.icon && this.props.fontSize) {
      const Icon = this.props.icon
      return (
        <Icon
          fill={this.props.fill || btPurple}
        />
      )
    }
  }

  get fontSizeMessage() {
    if (this.props.fontSize && !this.state.valid && this.state.message)
    return (
      <ProfileErrorMessage
        fontSize={this.props.fontSize}
      >
        {this.state.message}
      </ProfileErrorMessage>
    )
  }

  render() {
    return (
      <ProfileFieldContainer
        onClick={this.startEditing}
        fontSize={this.props.fontSize}
        label={this.props.label}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <IconContainer>
          {this.showIcon}
        </IconContainer>

        {this.showLabel}

        <ProfileFieldContents
          hover={this.state.hover}
          canEdit={this.state.canEdit}
          ownProfile={this.props.ownProfile}
          fontSize={this.props.fontSize}
        >
          {this.inputOrDisplay}
        </ProfileFieldContents>

        {this.fontSizeEditIcon}
        {this.fontSizeMessage}

      </ProfileFieldContainer>
    )
  }

}



export default ProfileField
