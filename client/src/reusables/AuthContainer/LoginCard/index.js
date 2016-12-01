import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import LoginInput from './LoginInput'
import {validate, warn} from './validate'


class LoginCard extends Component {
  constructor(props) {
    super(props)
    this.attemptLogin = this.props.attemptLogin.bind(this)
    this.awaitingLoginResponse = this.props.awaitingLoginResponse
    this.disableFields = false
    this.errorMessage = this.props.loginError
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.attemptLogin()
    this.disableFields = true
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.loginError) {
      this.errorMessage = nextProps.loginError
    }
    if (!nextProps.awaitingLoginResponse) {
      this.disableFields = false
    }
  }

  render() {
    return (
        <form
          onSubmit={this.handleSubmit}
        >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '10%',
            transition: 'opacity 1s',
            alignContent: 'space-between',
            allignItems: 'stretch'
          }}
        >

          <Field
            name="email"
            type="text"
            component={LoginInput}
            label="email"
            disableField={this.disableFields}
          />

          <Field
            name="password"
            type="password"
            component={LoginInput}
            label="password"
            disableField={this.disableFields}
          />

          <div
            style={{
              minHeight: '1em',
              margin: '.5em',
              color: 'red'
            }}
          >
            <span>{this.errorMessage}</span>
          </div>

          <button
            type="submit"
            style={{
              display: 'flex',
              width: '100%',
              marginTop: '15px',
              justifyContent: 'center'
            }}
            disabled={(this.props.invalid && !this.props.submitting)}
          >
            Login
          </button>
          </div>
        </form>
    )
  }
}


LoginCard = reduxForm({
  form: 'login',
  validate,
  warn,
})(LoginCard)

export default LoginCard
