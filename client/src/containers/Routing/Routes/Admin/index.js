import React, { Component } from 'react'
import Relay from 'react-relay'
import {allUsers, deleteAllUsers} from 'apis/btCarlInfo'
import BTButton from 'reusables/BTButton'
import {newLoginOptions, newSignupOptions} from 'config/auth0'



class Admin extends Component {

  state = {
    allUsers: false
  }

  showAllUsers = async () => {
    if (!this.state.allUsers) {
      let options = allUsers()
      const result = await fetch(...options).then(resp=>resp.json()).then(json=>json)
      console.log('result', result)
      const allUserList = result.data.allUsers

      let display = allUserList.map((user)=>{
        return (
          <div
            key={user.auth0id}
          >
            <b>{user.name}</b>
            <i>{user.email}</i>
            <p>{user.auth0id}</p>
          </div>
        )
      })

      this.setState({
        allUsers: display
      })
    }
  }

  deleteAllUsers = async() => {
    let options = deleteAllUsers()
    const result = await fetch(...options).then(resp=>resp.json()).then(json=>json)
    console.log(result)
  }

  login = async() => {
    let options = newLoginOptions(this.state.email, this.state.password)
    const result = fetch(...options).then(r=>r.json()).then(json=>json)
    console.log(result)
  }

  get onlyShowInDevelopment() {
    if (process.env.NODE_ENV === 'production') {
      return (
        <h2>Not allowed</h2>
      )
    } else {
      // this.showAllUsers()
      return (
        <div>

          <h2>hello</h2>

          <button
            onClick={auth.login}
          >
            fuck this
          </button>

          {/* <input
            type={'text'}
            onChange={
              (e)=>{
                this.setState({
                  email: e.target.value
                })
              }
            }
          />

          <input
            type={'password'}
            onChange={
              (e)=>{
                this.setState({
                  password: e.target.value
                })
              }
            }
          />

          <button
            onClick={window.open(...newSignupOptions(), '_self')}
          >
            Login
          </button>

          <h3>Admin</h3>
          <BTButton
            danger
            text={'Delete All Users'}
            onClick={this.deleteAllUsers}
          />

          {this.state.allUsers}*/}

        </div>
      )
    }
  }


  render() {
    console.log(this.props.router)
    return (
      <section>
        {this.onlyShowInDevelopment}
      </section>
    )
  }
}

export default Relay.createContainer(
  Admin,
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
