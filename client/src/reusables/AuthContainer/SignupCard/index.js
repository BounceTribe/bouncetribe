import React, {Component} from 'react'
import Relay from 'react-relay'
import {auth0Signup, auth0Login} from '../auth0SignupLogin'
import CreateUserMutation from 'mutations/CreateUserMutation'
import SigninUserMutation from 'mutations/SigninUserMutation'
import BTButton from 'reusables/BTButton'
import BTEditableField from 'reusables/BTEditableField'
import {fbAccessRoute} from 'config/auth0'


class SignupCard extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      signupError: ''
    }
  }

  handleCreatePerson = async () => {
    const {
      attemptSignup,
      signupSuccess,
      attemptLogin,
      loginSuccess,
      router
    } = this.props

    const email = this.state.email
    const password = this.state.password

    try {

      attemptSignup()

      const signedupUser= await auth0Signup(email, password)

      signupSuccess()


      attemptLogin()

      const loggedinUser = await auth0Login(signedupUser.email, password)

      this.props.relay.commitUpdate(
        new CreateUserMutation({
          email: email,
          idToken: loggedinUser['id_token']
        }), {
          onSuccess: (response) => {
            console.log('success', response)
            this.props.relay.commitUpdate(
              new SigninUserMutation({
                authToken: loggedinUser['id_token'],
                viewer: this.props.viewer
              }), {
                onSuccess: (response) => {
                  console.log('success', response)
                  this.setState({
                    email: '',
                    password: ''
                  })
                  loginSuccess(loggedinUser['id_token'])
                  router.push('/')
                },
                onFailure: (error) => {
                  console.log('SigninUserMutation failure', error)
                  throw error
                }
              }
            )
          },
          onFailure: (error) => {
            console.log('CreateUserMutationmutation failure', error)
            throw error
          }
        }
      )

    } catch (error) {
      console.log('signup, mutation, login error', error)
      this.setState({
        signupError: error['error_description']
      })
    }

  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <BTEditableField
          label={'Email'}
          type={'text'}
          value={this.state.email}
          onChange={(e) => this.handleEmailChange(e)}
        />

        <BTEditableField
          label={'Password'}
          type={'password'}
          value={this.state.password}
          onChange={(e) => this.handlePasswordChange(e)}
        />

        <br />

          <div>
            {this.state.signupError ? this.state.signupError.toString() : null}
          </div>


            <BTButton
              onClick={()=>{this.handleCreatePerson()}}
              text={'Signup'}
            />

            <BTButton
              onClick={()=>{
                window.open(fbAccessRoute, '_self')

              }}
              text={'Facebook'}
              teal
            />

      </div>
    )
  }

}

export default Relay.createContainer(
  SignupCard,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user
        }
      `,
    },
  }
)
