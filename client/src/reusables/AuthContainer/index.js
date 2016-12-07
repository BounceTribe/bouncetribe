import React, {Component} from 'react'
import {connect} from 'react-redux'
import SignupCard from './SignupCard'
import Relay from 'react-relay'
import ProfileCard from './ProfileCard'
import LoginCard from './LoginCard'
import LoginSignupTabs from './LoginSignupTabs'

import {attemptSignup, attemptLogin, loginSuccess, signupSuccess, logout} from 'actions/auth'

class AuthContainer extends Component {
  constructor () {
    super()
    this.state = {
      loginCardShowing: true,
      signupCardShowing: false,
    }
  }

  handleLogout = () => {
    this.props.logout()
    this.props.router.push('/')
  }

  showLoginCard = () => {
    this.setState({
      loginCardShowing: true,
      signupCardShowing: false
    })
  }

  showSignupCard = () => {
    this.setState({
      loginCardShowing: false,
      signupCardShowing: true
    })
  }


  get showProfile() {
    if (this.props.isLoggedIn) {
      return (
        <ProfileCard
          logout={this.handleLogout}
          viewer={this.props.viewer}
        />
      )
    }
   else if (!this.props.isLoggedIn && this.state.loginCardShowing){
      return (
        <LoginCard
          attemptLogin={this.props.attemptLogin}
          loginSuccess={this.props.loginSuccess}
          viewer={this.props.viewer}
        />
      )
    }
    else if (!this.props.isLoggedIn && this.state.signupCardShowing) {
      return (
        <SignupCard
          attemptLogin={this.props.attemptLogin}
          attemptSignup={this.props.attemptSignup}
          signupSuccess={this.props.signupSuccess}
          loginSuccess={this.props.loginSuccess}
          viewer={this.props.viewer}
        />
      )
    }
  }

  get showTabs() {
    if (!this.props.isLoggedIn) {
      return (
        <LoginSignupTabs
          showSignupCard={this.showSignupCard}
          showLoginCard={this.showLoginCard}
          loginCardShowing={this.state.loginCardShowing}
          signupCardShowing={this.state.signupCardShowing}
        />
      )
    }
  }

  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: 'solid 1px black'
        }}
      >
        {this.showTabs}
        <div
          style={{
            margin: '5px'
          }}
        >
          {this.showProfile}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth['id_token']
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: () => {
      dispatch(attemptLogin())
    },
    attemptSignup: () => {
      dispatch(attemptSignup())
    },
    loginSuccess: (idToken) => {
      dispatch(loginSuccess(idToken))
    },
    logout: () => {
      dispatch(logout())
    },
    signupSuccess: () => {
      dispatch(signupSuccess())
    },
  }
}

AuthContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer)


export default Relay.createContainer(
  AuthContainer,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          ${SignupCard.getFragment('viewer')}
          ${LoginCard.getFragment('viewer')}
          ${ProfileCard.getFragment('viewer')}

        }
      `,
    },
  }
)
