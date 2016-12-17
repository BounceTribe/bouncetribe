import React, { Component } from 'react'
import Relay from 'react-relay'
import {allUsers, deleteAllUsers} from 'apis/btCarlInfo'
import BTButton from 'reusables/BTButton'


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

  get onlyShowInProduction() {
    if (process.env.PRODUCTION) {
      return (
        <h2>Not allowed</h2>
      )
    } else {
      this.showAllUsers()
      return (
        <div>
          <h3>Admin</h3>
          <BTButton
            danger
            text={'Delete All Users'}
            onClick={this.deleteAllUsers}
          />

          {this.state.allUsers}

        </div>
      )
    }
  }


  render() {
    return (
      <section>
        {this.onlyShowInProduction}
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
