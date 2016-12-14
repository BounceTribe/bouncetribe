import React, { Component } from 'react'
import styled from 'styled-components'
import {btMedium, btTeal, btWarn, btDark} from 'styling/T'

const labelFocusMargin = (props) => {
  if (props.focus || props.value.length > 0 || props.error) {
    return '.5em'
  } else {
    return '1.25em'
  }
}

const labelFocusFontSize = (props) => {
  if (props.focus || props.value.length > 0 || props.error) {
    return '.7em'
  } else {
    return '1em'
  }
}

const inputUnderline = (props) => {
  if (props.error) {
    return `solid 3px ${btWarn}`
  } else if (props.focus || props.value) {
    return `solid 3px ${btTeal}`
  } else {
    return `solid 3px ${btMedium}`
  }
}

const Container = styled.div`
  width: 250px;
  box-sizing: border-box;
`

const Input = styled.input`
  position: relative;
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
  z-index: 1;
`

const Label = styled.label`
  width: 250px;
  position: absolute;
  padding: .85em .15em .4em 0em;
  margin-top: ${props => labelFocusMargin(props)};
  font-size: ${props => labelFocusFontSize(props)};
  line-height: 1em;
  transition: all 2s;
  border-bottom: solid 3px transparent;
  transition: all .3s;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const LabelText = styled.span`
  color: ${btDark};
`

const ErrorText = styled.span`
  color: ${btWarn};
`

class BTEditableField extends Component {
  state = {
    text: '',
  }
  //
  // handleFocus = () => {
  //   this.setState({
  //     focus: true,
  //   })
  // }
  //
  // handleBlur = () => {
  //   this.setState({
  //     focus: false,
  //   })
  // }

  // editText = (e) => {
  //   this.setState({
  //     content: e.target.value
  //   })
  // }

  render() {
    return (
      <Container>
        <Label
          focus={this.props.focus}
          blur={this.props.blur}
          value={this.state.text}
          error={this.props.error}
        >
          <LabelText>
            {this.props.label}
          </LabelText>
          <ErrorText>
            {this.props.error}
          </ErrorText>
        </Label>
        <Input
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChange={(e) => {
            this.setState({
              text: e.target.value
            })
            this.props.onChange(e)
          }}
          focus={this.props.focus}
          blur={this.props.blur}
          type={this.props.type}
          value={this.state.text}
          error={this.props.error}
        />
      </Container>
    )
  }
}

export default BTEditableField
