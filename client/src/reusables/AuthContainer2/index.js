import React, {Component} from 'react'
import Relay from 'react-relay'
import {connect} from 'react-redux'
import BTEditableField from 'reusables/BTEditableField'
import BTButton from 'reusables/BTButton'
import {fbAccessRoute, loginOptions, loginRoute, profileRoute, profileOptions} from 'config/auth0'
import {checkIfUserExists} from 'apis/graphql'
import SigninUserMutation from 'mutations/SigninUserMutation'
import {loginSuccess} from 'actions/auth'

class AuthContainer2 extends Component {

  state = {
    email: {
      value: '',
      focus: false,
      blur: false,
      valid: true,
      error: false,
    },
    password: {
      value: '',
      focus: false,
      blur: false,
      valid: true,
      error: false,
    }
  }

  emailChange = (e) => {
    this.emailDebounce()
    this.setState({
      email: {
        ...this.state.email,
        value: e.target.value,
        error: false,
      }
    })
    this.emailTimerStart(e.target.value)
  }

  passwordChange = (e) => {
    this.passwordDebounce()
    this.setState({
      password: {
        ...this.state.password,
        value: e.target.value,
        error: false
      }
    })
    this.passwordTimerStart(e.target.value)
  }

  emailFocus = () => {
    this.setState({
      email: {
        ...this.state.email,
        focus: true,
      }
    })
  }

  passwordFocus = () => {
    this.setState({
      password: {
        ...this.state.password,
        focus: true,
      }
    })
  }


  emailBlur = () => {
    this.setState({
      email: {
        ...this.state.email,
        blur: true,
        focus: false,
      }
    })
    this.emailValidator(this.state.email.value)
  }

  passwordBlur = () => {
    this.setState({
      password: {
        ...this.state.password,
        blur: true,
        focus: false,
      }
    })
    this.passwordValidator(this.state.password.value)
  }

  emailValidator = async (email) => {
    if (email.length > 0) {
      let at = email.indexOf("@");
      let dot = email.lastIndexOf(".");
      if (at<1 || dot<at+2 || dot+2 >= email.length) {
        this.setState({
          email: {
            ...this.state.email,
            error: 'Must be a valid email address.'
          }
        })
        return
      }
    }
    if (email.length < 1) {
      this.setState({
        email: {
          ...this.state.email,
          error: "Don't forget your email."
        }
      })
      return
    }
    this.setState({
      email: {
        ...this.state.email,
        error: false
      }
    })
  }

  passwordValidator = async (password) => {
    if (password.length < 1) {
      this.setState({
        password: {
          ...this.state.password,
          error: "You'll need a password."
        }
      })
      return
    }
    this.setState({
      password: {
        ...this.state.password,
        error: false
      }
    })
  }

  emailTimerStart = (email) => {
    const emailTimer = setTimeout(()=> {
      this.emailValidator(email)
    },1000)
    this.setState({
      emailTimer: emailTimer
    })
  }

  emailDebounce = () => {
    if (this.state.emailTimer) {
      clearTimeout(this.state.emailTimer)
    }
  }


  passwordTimerStart = (password) => {
    const passwordTimer = setTimeout(()=> {
      this.passwordValidator(password)
    },1000)
    this.setState({
      passwordTimer: passwordTimer
    })
  }

  passwordDebounce = () => {
    if (this.state.passwordTimer) {
      clearTimeout(this.state.passwordTimer)
    }
  }


  checkForAuth0Account = async () => {
    let email = this.state.email.value
    let password = this.state.password.value
    let route = loginRoute
    let options = loginOptions(email, password)
    try {
      const auth0Account = await fetch(route,options).then(data => data.json()).then((json) => {
        if (json.error) {
          throw json
        } else {
          return json
        }
      })
      return auth0Account
    } catch (error) {
      console.log('checkForAuth0Account error', error)
      throw error
    }
  }

  checkForBtAccount = async (userAuth0id) => {
    let options = checkIfUserExists(userAuth0id)
    try {
      const btAccount = await fetch(...options).then(data => data.json()).then((json) => {
        console.log('btAccount', json)
        if (json.data.allUsers.length < 1) {
          throw json
        } else {
          return json
        }
      })
      return btAccount
    } catch (error) {
      console.log('checkForBtAccount error', error)
      throw error
    }
  }

  getAuth0Profile = async (idToken) => {
    let route = profileRoute
    let options = profileOptions(idToken)
    try {
      const auth0Profile = await fetch(route, options).then(data => data.json()).then((json) => {
        if (json.error) {
          throw json
        } else {
          return json
        }
      })
      return auth0Profile
    } catch (error) {
      console.log('getAuth0Profile error', error)
      throw error
    }
  }

  btRelaySigninMutation = async(idToken) => {
    try {
      this.props.relay.commitUpdate(
        new SigninUserMutation({
          authToken: idToken,
          viewer: this.props.viewer
        }), {
          onSuccess: (response) => {
            console.log('btRelaySigninMutation success', response)
            this.setState({
              email: {value: ''},
              password: {value: ''}
            })
            this.props.loginSuccess(response.signinUser.token)
          },
          onFailure: (error) => {
            console.log('SigninUserMutation failure', error)
            throw error
          }
        }
      )
    } catch (error) {
      console.log('btRelaySigninMutation error', error)
    }
  }


  runIt = async () => {
    try {
      const validAuth0Account = await this.checkForAuth0Account()

      console.log('validAuth0Account', validAuth0Account)

      const idToken = validAuth0Account['id_token']

      const auth0Profile = await this.getAuth0Profile(idToken)

      console.log('auth0Profile', auth0Profile)

      const validBtAccount = await this.checkForBtAccount(auth0Profile['user_id'])

      console.log('validBtAccount', validBtAccount)

      this.btRelaySigninMutation(idToken)

    } catch (error) {
      console.log('runit error', error)
    }
  }

  render() {
    return (
      <div>

        <BTButton
          onClick={()=>{
            window.open(fbAccessRoute, '_self')

          }}
          text={'Facebook'}
          teal
        />

        <BTEditableField
          label={'Email'}
          type={'text'}
          value={this.state.email.value}
          onChange={(e) => this.emailChange(e)}
          onFocus={this.emailFocus}
          focus={this.state.email.focus}
          onBlur={this.emailBlur}
          blur={this.state.email.blur}
          valid={this.state.email.valid}
          error={this.state.email.error}
        />

        <BTEditableField
          label={'Password'}
          type={'password'}
          value={this.state.password.value}
          onChange={(e) => this.passwordChange(e)}
          onFocus={this.passwordFocus}
          focus={this.state.password.focus}
          onBlur={this.passwordBlur}
          blur={this.state.password.blur}
          valid={this.state.password.valid}
          error={this.state.password.error}
        />

        <br/>

        <BTButton
          onClick={this.runIt}
          text={'Login / Signup'}
        />

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth['id_token'],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: (idToken) => {
      dispatch(loginSuccess(idToken))
    },
  }
}

AuthContainer2 = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer2)

export default Relay.createContainer(
  AuthContainer2,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          id
        }
      `,
    },
  }
)
