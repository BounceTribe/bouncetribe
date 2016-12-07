import React, {Component} from 'react'
import Relay from 'react-relay'
import {auth0Login} from '../auth0SignupLogin'


class LoginCard extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loginError: ''
    }
  }

  handleCreatePerson = async () => {
    const {
      attemptLogin,
      loginSuccess
    } = this.props

    const email = this.state.email
    const password = this.state.password

    try {

      attemptLogin()

      const loggedinUser = await auth0Login(email, password)


      loginSuccess(loggedinUser['id_token'])


    } catch (error) {
      this.setState({
        loginError: error
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
            {this.state.loginError ? this.state.loginError.toString() : null}
          </li>

          <li>
            <button
              onClick={()=>{this.handleCreatePerson()}}
            >Login</button>
          </li>
        </ol>

      </div>
    )
  }

}

export default Relay.createContainer(
  LoginCard,
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
