import React, { Component } from 'react'
import styled from 'styled-components'
import {btMedium, btTeal, btWarn} from 'styling/T'

const labelFocusMargin = (props) => {
  if (props.focus || props.content) {
    return '.5em'
  } else {
    return '1.25em'
  }
}

const labelFocusFontSize = (props) => {
  if (props.focus || props.content) {
    return '.7em'
  } else {
    return '1em'
  }
}

const inputUnderline = (props) => {
  if ((props.focus || props.content) && props.error) {
    return `solid 3px ${btWarn}`
  } else if (props.focus || props.content) {
    return `solid 3px ${btTeal}`
  } else {
    return `solid 3px ${btMedium}`
  }
}

const Container = styled.div`
  width: 200px;
  box-sizing: border-box;
`

const Input = styled.input`
  width: 100%;
  padding: .85em .15em .4em .15em;
  margin-top: 1em;
  line-height: 1em;
  box-sizing: border-box;
  outline: none;
  border: none;
  border-bottom: ${props => inputUnderline(props)};
  background: transparent;
  font-size: 1em;
  transition: all .3s;
`

const Label = styled.label`
  width: 100%;
  position: absolute;
  padding: .85em .15em .4em 0em;
  margin-top: ${props => labelFocusMargin(props)};
  font-size: ${props => labelFocusFontSize(props)};
  line-height: 1em;
  z-index: -2;
  transition: all 2s;
  border-bottom: solid 3px transparent;
  transition: all .3s;
`

class BTEditableField extends Component {
  state = {
    focus: false,
    content: '',
    error: false
  }

  handleFocus = () => {
    this.setState({
      focus: true,
    })
  }

  handleBlur = () => {
    this.setState({
      focus: false,
    })
  }

  editText = (e) => {
    this.setState({
      content: e.target.value
    })
  }

  render() {
    return (
      <Container>
        <Label
          focus={this.state.focus}
          content={this.state.content}
          error={this.state.error}
        >
          <span>
            {this.props.label}
          </span>
          <span>
            {this.props.error}
          </span>
        </Label>
        <Input
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={(e) => {
            this.editText(e)
            this.props.onChange(e)
          }}
          focus={this.state.focus}
          content={this.state.content}
          type={this.props.type}
          value={this.props.value}
        />
      </Container>
    )
  }
}

export default BTEditableField
