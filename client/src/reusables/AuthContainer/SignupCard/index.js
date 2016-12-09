import React, {Component} from 'react'
import Relay from 'react-relay'
import {auth0Signup, auth0Login} from '../auth0SignupLogin'
import CreateUserMutation from './CreateUserMutation'


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
      loginSuccess
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
            this.setState({
              email: '',
              password: ''
            })
            loginSuccess(loggedinUser['id_token'])
            location.reload()
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
        signupError: error
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
        <ol>
          <li>
            Email:
            <input
              type="text"
              value={this.state.email}
              onChange={(e) => this.handleEmailChange(e)}
            />
          </li>
          <li>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={(e) => this.handlePasswordChange(e)}
            />
          </li>

          <li>
            {this.state.signupError ? this.state.signupError.toString() : null}
          </li>

          <li>
            <button
              onClick={()=>{this.handleCreatePerson()}}
            >Signup</button>
          </li>
        </ol>

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
