import React, {Component} from 'react'
import Relay from 'react-relay'
import {connect} from 'react-redux'
import BTEditableField from 'reusables/BTEditableField'
import BTButton from 'reusables/BTButton'
import {fbAccessRoute, loginOptions, loginRoute, profileRoute, profileOptions, signupRoute, signupOptions, linkAccountsOptions} from 'config/auth0'
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


  state = {
    email: {
      value: '',
      focus: false,
      blur: false,
      valid: true,
      error: false,
      message: false,
      disabled: false
    },
    password: {
      value: '',
      focus: false,
      blur: false,
      valid: true,
      error: false,
      message: false,
      disabled: false
    },
    signupDisabled: 'enter your email',
    loginDisabled: 'enter your email',
    mode: 'SOCIAL'
  }

  componentDidMount() {
    this.handleSocial()
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
      },
      loginDisabled: `...checking email...`,
      signupDisabled: `...checking email...`
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
      },
      loginDisabled: '...checking password...',
      signupDisabled: '...checking password...'
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
    this.emailDebounce()
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
          },
          loginDisabled: 'check your email',
          signupDisabled: 'check your email'
        })
        return
      }
      if (email.length > 8) {
        this.checkBtForEmail(this.state.email.value)
      }
    }
    if (email.length < 1) {
      this.setState({
        email: {
          ...this.state.email,
          error: "Don't forget your email."
        },
        loginDisabled: 'check your email',
        signupDisabled: 'check your email'
      })
      return
    }
    this.setState({
      email: {
        ...this.state.email,
        error: false
      }
    })

    this.passwordValidator(this.state.password.value)

    if (!this.state.email.error && !this.state.password.error && this.state.password.value > 8) {
      this.setState({
        loginDisabled: false,
        signupDisabled: false
      })
    }
  }

  passwordValidator = async (password) => {
    if (password.length < 1) {
      this.setState({
        password: {
          ...this.state.password,
        },
        loginDisabled: 'Enter your password',
        signupDisabled: 'Enter your password'
      })
      return
    }
    if (password.length < 8) {
      this.setState({
        password: {
          ...this.state.password,
          error: "Password must be 8 characters."
        },
        loginDisabled: 'Check your password',
        signupDisabled: 'Check your password'
      })
      return
    }
    this.setState({
      password: {
        ...this.state.password,
        error: false
      },
    })
    if (!this.state.email.error) {
      this.setState({
        loginDisabled: false,
        signupDisabled: false
      })
    }
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
    },250)
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
      const btAccount = await fetch(...options).then(data => data.json()).then((json) => {
        console.log('btAccount', json)
        if (json.data.allUsers.length < 1) {
          throw json
        } else {
          return json.data.allUsers[0]
        }
      })
      console.log('checkIfUserEmailExists, exists', btAccount)
      let name = btAccount.name
      let provider = btAccount.auth0UserId.split('|')[0]

      if (provider === 'auth0') {
        this.setState({
          mode: 'LOGIN',
          email: {
            ...this.state.email,
            message: `Welcome back ${name}!`
          },
          signupDisabled: true
        })
        this.passwordValidator(this.state.password.value)
      } else if (provider === 'facebook') {
        this.setState({
          email: {
            ...this.state.email,
            message: `Hi ${name}! Your account is through Facebook. Sign in with the button above`
          },
          password: {
            error: false,
            message: false,
            value: '',
            disabled: true,
            focus: false,
            blur: false,
            valid: true
          },
          signupDisabled: true,
          loginDisabled: true
        })
      } else {
        console.log('auth0 provider not recognized', provider)
        throw provider
      }
    } catch (error) {
      console.log('checkIfUserEmailExists, doesnt exist', error)
      this.setState({
        mode: 'SIGNUP',
        email: {
          ...this.state.email,
          message: "New user? We'll create you an account."
        },
        loginDisabled: true
      })
    }
  }


  checkBtForEmailSocial = async(email) => {
    let options = checkIfUserEmailExists(email)
    try {
      const matchingUser = await fetch(...options).then(data => data.json()).then((json) => {
        console.log('btAccount', json)
        if (json.data.allUsers.length !== 1) {
          throw json
        } else {
          let user = json.data.allUsers[0]
          console.log('matching user', user)
          return user
        }
      })
      return matchingUser
    } catch (error) {
      console.log('checkIfUserEmailExists, doesnt exist', error)
      throw error
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
        if (json.data.allUsers.length !== 1) {
          throw json
        } else {
          return json.data.allUsers[0]
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
    this.setState({
      email: {
        ...this.state.email,
        disabled: true,
      },
      password: {
        ...this.state.password,
        disabled: true,
      },
      loginDisabled: '...logging in...',
      signupDisabled: true,
      socialDisabled: true,
    })
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
          disabled: false,
        },
        password: {
          ...this.state.password,
          disabled: false,
        },
        socialDisabled: false,
        loginDisabled: '...login error...',
      })
    }
  }

  signup = async () => {
    this.setState({
      email: {
        ...this.state.email,
        disabled: true,
      },
      password: {
        ...this.state.password,
        disabled: true,
      },
      loginDisabled: true,
      signupDisabled: '...signing up...',
      socialDisabled: true,
    })
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
      this.setState({
        email: {
          ...this.state.email,
          disabled: false,
        },
        password: {
          ...this.state.password,
          disabled: false,
        },
        socialDisabled: false,
        signupDisabled: '...signup error...'
      })
    }
  }

  handleSocial = async() => {
    if (this.props.router.location.pathname === '/social/') {
      console.log('Someone is trying to access the site using a social login...')

      this.setState({
        email: {
          ...this.state.email,
          disabled: true,
        },
        password: {
          ...this.state.password,
          disabled: true,
        },
        loginDisabled: true,
        signupDisabled: true,
        socialDisabled: true,
        mode: 'SOCIAL'
      })

      let hash = this.props.router.location.hash
      const idToken = hash.split('&id_token=')[1].split('&')[0]

      try {
        console.log('Checking to see if they have an auth0 profile...')
        const auth0Profile = await this.getAuth0Profile(idToken)
        const auth0id = auth0Profile['user_id']
        const email = auth0Profile.email
        console.log('This is their auth0Profile: \n', auth0Profile, '\n Email: ', email, '\n auth0id: ', auth0id)
        try {
          console.log('Checking to see if they have a BT account associated with auth0id:', auth0id)
          const validBtAccount = await this.checkForBtAccount(auth0id)
          console.log('Found a btAccount with that auth0id:', validBtAccount)
          if (validBtAccount) {
            console.log('Attempting to login...')
            this.btRelaySigninMutation(idToken)
          }
        } catch (error) {
          console.log("Didn't find a btAccount with that auth0id.")
          try {
            console.log("Checking to see if there is a btAccount with that email: ", email)
            const accountWithSameEmail = await this.checkBtForEmailSocial(email)
            if (accountWithSameEmail) {
              console.log('Found bt account with same email: \n', accountWithSameEmail)
              try {
                console.log('Attempting to link new account under existing account...')
                let primaryAuth0UserId = accountWithSameEmail.auth0UserId
                let secondaryProvider = auth0id.split('|')[0]
                let secondaryAuth0Id = auth0id
                const linkOptions = linkAccountsOptions(primaryAuth0UserId, secondaryProvider, secondaryAuth0Id)
                const linkedAccount = await fetch(...linkOptions).then(data=>{
                  console.log(data)
                  if (data.status !== 201) {
                    throw data.json()
                  } else {
                    return data.json()
                  }
                }).then((json)=>{
                  return json
                })
                if (linkedAccount) {
                  console.log('Accounts were succesfully linked: \n', linkedAccount)
                  console.log('Going back to social to refresh token for linked accounts.')
                  window.open(fbAccessRoute, '_self')
                }
              } catch (error) {
                console.log('Linking error', error)
              }
            }
          } catch (error) {
            console.log("Didn't find a bt account with that email.", error)
            try {
              console.log('Attempting to create a new bt user.')
              this.btRelayCreateUserMutation(email, idToken)
            } catch (error) {
              console.log('CreateUserMutation error', error)
            }
          }
        }
      } catch (error) {
        console.log('There was a problem finding their auth0 profile', error)
        this.setState({
          email: {
            value: '',
            focus: false,
            blur: false,
            valid: true,
            error: false,
            message: false,
            disabled: false
          },
          password: {
            value: '',
            focus: false,
            blur: false,
            valid: true,
            error: false,
            message: false,
            disabled: false
          },
          signupDisabled: 'enter your email',
          loginDisabled: 'enter your email',
          socialDisabled: false,
          mode: 'SOCIAL_ERROR',
          errorButton: 'Sorry, there was an error. Try again.'
        })
        this.props.router.push('/')
      }
    } else {
      this.setState({
        mode: false
      })
    }
  }

  get showButton() {
    let {
      signupDisabled,
      loginDisabled,
      mode,
      errorButton,
      email,
      password
    } = this.state

    if (mode === 'SIGNUP') {
      return (
        <BTButton
          onClick={this.signup}
          text={(signupDisabled) ? signupDisabled : 'Signup'}
          teal
          flex
          disabled={signupDisabled}
          danger={(email.error || password.error)}
        />
      )
    } else if (mode === 'LOGIN') {
      return (
        <BTButton
          onClick={this.login}
          text={(loginDisabled) ? loginDisabled : 'Login'}
          teal
          flex
          disabled={loginDisabled}
          danger={(email.error || password.error)}
        />
      )
    } else if (mode === 'SOCIAL_ERROR') {
      return (
        <BTButton
          text={errorButton}
          flex
          disabled={true}
          danger
        />
      )
    } else {
      return (
        <BTButton
          text={'Enter Email'}
          flex
          disabled={true}
          teal
          danger={(email.error)}
        />
      )
    }
  }

  get showEverything(){
    if (this.state.mode !== 'SOCIAL') {
      return (
        <div>

          <BTButton
            onClick={()=>{
              window.open(fbAccessRoute, '_self')

            }}
            text={'Facebook'}
            fb
            flex
            disabled={this.state.socialDisabled}
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
            disabled={this.state.email.disabled}
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
            disabled={this.state.password.disabled}
          />

          <br/>

          {this.showButton}

        </div>
      )
    } else {
      return (
        null
      )
    }
  }

  render() {
    return (
      <AuthDiv>
        {this.showEverything}
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
