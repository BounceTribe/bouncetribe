import React, {Component} from 'react'
import Relay from 'react-relay'
import {connect} from 'react-redux'
import BTEditableField from 'reusables/BTEditableField'
import BTButton from 'reusables/BTButton'
import {fbAccessRoute, loginOptions, loginRoute, profileRoute, profileOptions, signupRoute, signupOptions} from 'config/auth0'
import {checkIfUserExists, checkIfUserEmailExists} from 'apis/graphql'
import SigninUserMutation from 'mutations/SigninUserMutation'
import CreateUserMutation from 'mutations/CreateUserMutation'
import {loginSuccess} from 'actions/auth'
import styled from 'styled-components'

const AuthDiv = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 250px;
`

class AuthContainer2 extends Component {

  constructor(props) {
    super(props)
    this.handleSocial()
  }

  state = {
    email: {
      value: '',
      focus: false,
      blur: false,
      valid: true,
      error: false,
      message: false
    },
    password: {
      value: '',
      focus: false,
      blur: false,
      valid: true,
      error: false,
      message: false
    }
  }

  emailChange = (e) => {
    this.emailDebounce()
    this.setState({
      email: {
        ...this.state.email,
        value: e.target.value,
        error: false,
        message: false
      },
      password: {
        ...this.state.password,
        error: false,
        message: false
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
        error: false,
        message: false
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
    this.checkBtForEmail(this.state.email.value)
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
    },1500)
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


  checkBtForEmail = async(email) => {
    let options = checkIfUserEmailExists(email)
    try {
      const btEmail = await fetch(...options).then(data => data.json()).then((json) => {
        console.log('btAccount', json)
        if (json.data.allUsers.length < 1) {
          throw json
        } else {
          return json
        }
      })
      console.log('checkIfUserEmailExists, exists', btEmail)
      let name = btEmail.data.allUsers[0].name
      this.setState({
        mode: 'LOGIN',
        email: {
          ...this.state.email,
          message: `Welcome back ${name}!`
        }
      })
    } catch (error) {
      console.log('checkIfUserEmailExists, doesnt exist', error)
      this.setState({
        mode: 'SIGNUP',
        email: {
          ...this.state.email,
          message: "New user? We'll create you an account."
        }
      })
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
      if (error.error === 'invalid_user_password') {
        this.setState({
          password: {
            ...this.state.password,
            error: "Password doesn't match email."
          }
        })
      }
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

  auth0Signup = async () => {
    let email = this.state.email.value
    let password = this.state.password.value
    let route = signupRoute
    let options = signupOptions(email, password)
    try {
      const auth0Account = fetch(route, options).then(
        (response) => response.json()
      ).then((json) => {
          if (json.error) {
            throw json
          } else {
            return json
          }
      })
      return auth0Account
    } catch (error) {
      console.log('auth0Signup error', error)
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
            this.props.router.push({
              pathname: '/'
            })
          },
          onFailure: (error) => {
            console.log('SigninUserMutation failure', error)
            this.setState({
              email: {
                ...this.state.email,
                error: "Email not recgonized."
              }
            })
            throw error
          }
        }
      )
    } catch (error) {
      console.log('btRelaySigninMutation error', error)
    }
  }

  btRelayCreateUserMutation = async(email, idToken) => {
    this.props.relay.commitUpdate(
      new CreateUserMutation({
        email: email,
        idToken: idToken
      }), {
        onSuccess: (response) => {
          console.log('success', response)
          this.btRelaySigninMutation(idToken)
        },
        onFailure: (error) => {
          console.log('CreateUserMutation failure', error)
          throw error
        }
      }
    )
  }

  login = async () => {
    try {
      const validAuth0Account = await this.checkForAuth0Account()

      console.log('validAuth0Account', validAuth0Account)

      const idToken = validAuth0Account['id_token']

      const auth0Profile = await this.getAuth0Profile(idToken)

      console.log('auth0Profile', auth0Profile)

      let auth0id = auth0Profile['user_id']

      const validBtAccount = await this.checkForBtAccount(auth0id)

      console.log('validBtAccount', validBtAccount)

      this.btRelaySigninMutation(idToken)

    } catch (error) {
      console.log('login error', error)
      this.setState({
        email: {
          ...this.state.email,
          error: "Email not recgonized."
        }
      })
    }
  }

  signup = async () => {
    try {
      const auth0Account = await this.auth0Signup()

      console.log('auth0account', auth0Account)

      let email = auth0Account.email

      const loggedinUser = await this.checkForAuth0Account()

      let idToken = loggedinUser['id_token']

      console.log('loggedinUser', loggedinUser)

      this.btRelayCreateUserMutation(email, idToken)

    } catch (error) {
      console.log('signup error', error)
    }
  }

  get showButton() {
    if (this.state.mode === 'SIGNUP') {
      return (
        <BTButton
          onClick={this.signup}
          text={'Signup'}
          teal
          flex
        />
      )
    } else {
      return (
        <BTButton
          onClick={this.login}
          text={'Login'}
          flex
        />
      )
    }
  }

  handleSocial = async() => {
    console.log(this.props.router.location.pathname)
    if (this.props.router.location.pathname === '/social/') {
      let hash = this.props.router.location.hash
      const idToken = hash.split('&id_token=')[1].split('&')[0]

      try {
        const auth0Profile = await this.getAuth0Profile(idToken)

        console.log('auth0Profile', auth0Profile)

        const auth0id = auth0Profile['user_id']
        const email = auth0Profile.email

        if (auth0id) {
          try {
            const validBtAccount = await this.checkForBtAccount(auth0id)

            console.log('validBtAccount', validBtAccount)

            this.btRelaySigninMutation(idToken)
          } catch (error) {
            try {
              this.btRelayCreateUserMutation(email, idToken)
            } catch (error) {
              console.log('CreateUserMutation error', error)
            }
          }
        }

      } catch (error) {
        console.log('handleSocial error', error)
      }

    }
  }

  render() {
    return (
      <AuthDiv>

        <BTButton
          onClick={()=>{
            window.open(fbAccessRoute, '_self')

          }}
          text={'Facebook'}
          fb
          flex
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
          message={this.state.email.message}
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
          message={this.state.password.message}
        />

        <br/>


        {this.showButton}



      </AuthDiv>
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
