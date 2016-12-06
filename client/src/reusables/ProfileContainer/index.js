import React, {Component} from 'react'
import Relay from 'react-relay'
import CreateUserMutation from './CreateUserMutation'
import {signupRoute, signupOptions, loginRoute, loginOptions} from 'config/auth0'

class ProfileContainer extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    }
  }

  handleCreatePerson = async () => {

    let email = this.state.email
    let password = this.state.password
    let options = signupOptions(email, password)

    const auth0signupResult = await fetch(signupRoute, options).then(
      (response) => response.json()
    ).then((json) => {
        if (json.error) {
          throw json.error
        } else {
          return json
        }
    })

    options = loginOptions(email, password)

    const loginResult = await fetch(loginRoute, options).then(
      (response) => response.json()
    ).then((json) => {
        if (json.error) {
          throw json.error
        } else {
          return json
        }
    })

    this.props.relay.commitUpdate(
      new CreateUserMutation({
        email: email,
        idToken: loginResult['id_token']
      })
    )
    this.setState({
      email: '',
      password: ''
    })
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
            <button
              onClick={()=>{this.handleCreatePerson()}}
            >Create Person</button>
          </li>
        </ol>

      </div>
    )
  }

}

export default Relay.createContainer(
  ProfileContainer,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          allUsers(first: 2147483647) {
            edges {
              node {
                id,
                email,
              },
            },
          },
        }
      `,
    },
  }
)
