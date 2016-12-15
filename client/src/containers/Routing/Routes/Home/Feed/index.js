import React, {Component} from 'react'
import BTButton from 'reusables/BTButton'
import {linkAccountsOptions} from 'config/auth0'

class Feed extends Component {

  state = {
    userId: '',
    secondaryToken: ''
  }

  handleUserId = (e) =>{
    this.setState({
      userId: e.target.value
    })
  }

  handleToken = (e) =>{
    this.setState({
      secondaryToken: e.target.value
    })
  }


  mergeAccounts = async () => {
    let {
      userId,
      secondaryToken
    } = this.state
    let primaryToken = this.props.isLoggedIn
    let options = linkAccountsOptions(userId, primaryToken, secondaryToken)
    let result = await fetch(...options).then(data=>data.json()).then(json=>json)
    console.log(result)
  }

  render() {
    return (
      <section>
        <h1>Feed</h1>
        <h4>Woah cool check out your feed</h4>
        <BTButton
          onClick={this.props.logout}
          text={'Logout'}
        />

        <br/>
        <h4>idToken</h4>
        <h5><i>{this.props.isLoggedIn}</i></h5>
        <br/>

        <h4>userId</h4>
        <input
          onChange={(e) => this.handleUserId(e)}
          value={this.state.userId}
        />

        <br/>

        <h4>secondaryToken</h4>
        <input
          onChange={(e) => this.handleToken(e)}
          value={this.state.secondaryToken}
        />

        <br/>

        <button
          onClick={this.mergeAccounts}

        >
          Merge Accounts
        </button>

      </section>
    )
  }
}

export default Feed
