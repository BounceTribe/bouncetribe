import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import LoginInput from '../LoginCard/LoginInput'
import {validate, warn} from './validate'


class SignUpCard extends Component {
  constructor(props) {
    super(props)
    this.attemptSignup = this.props.attemptSignup.bind(this)
    this.awaitingSignupResponse = this.props.awaitingSignupResponse
    this.awaitingLoginResponse = this.props.awaitingLoginResponse
    this.disableFields = false
    this.errorMessage = this.props.signupError
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.attemptSignup()
    this.disableFields = true
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.loginError) {
      this.errorMessage = nextProps.loginError
    }
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '10%',
        }}
      >
        <Field
          name="email"
          type="text"
          component={LoginInput}
          label="Email"
          disableField={this.disableFields}
        />

        <Field
          name="password"
          type="password"
          component={LoginInput}
          label="Password"
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
            alignSelf: 'flex-end',
            width: '100%',
            marginTop: '15px',
            justifyContent: 'center'
          }}
          disabled={(this.props.invalid && !this.props.submitting)}
        >
          Signup
        </button>

      </form>
    )
  }
}


SignUpCard = reduxForm({
  form: 'signup',
  validate,
  warn,
  destroyOnUnmount: false
})(SignUpCard)

export default SignUpCard
