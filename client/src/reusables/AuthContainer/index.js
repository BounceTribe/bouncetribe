import React, {Component} from 'react'
import {connect} from 'react-redux'
import SignUpCard from './SignUpCard'
import ProfileCard from './ProfileCard'
import LoginCard from './LoginCard'
import LoginSignupTabs from './LoginSignupTabs'



import {attemptSignup, logout, attemptLogin} from 'actions/auth'

class AuthContainer extends Component {
  constructor () {
    super()
    this.state = {
      loginCardShowing: true,
      signupCardShowing: false,
    }
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
    if (this.props.user) {
      return (
        <ProfileCard
          logout={this.props.logout}
          user={this.props.user}
        />
      )
    }
    if (!this.props.isLoggedIn && this.state.loginCardShowing){
      return (
        <LoginCard
          attemptLogin={this.props.attemptLogin}
          awaitingLoginResponse={this.props.awaitingLoginResponse}
          loginError={this.props.loginError}
        />
      )
    }
    if (!this.props.isLoggedIn && this.state.signupCardShowing) {
      return (
        <SignUpCard
          attemptSignup={this.props.attemptSignup}
          awaitingSignupResponse={this.props.awaitingSignupResponse}
          awaitingLoginResponse={this.props.awaitingLoginResponse}
          signupError={this.props.signupError}
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
    awaitingLoginResponse: state.auth.awaitingLoginResponse,
    awaitingSignupResponse: state.auth.awaitingSignupResponse,
    user: state.auth.user,
    isLoggedIn: state.auth['id_token'],
    loginError: state.auth.loginError,
    signupError: state.auth.signupError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptSignup: () => {
      dispatch(attemptSignup())
    },
    attemptLogin: () => {
      dispatch(attemptLogin())
    },
    logout: () => {
      dispatch(logout())
    }
  }
}

AuthContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer)

export default AuthContainer
