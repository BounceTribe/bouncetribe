import React, {Component} from 'react'
import {connect} from 'react-redux'
import SignUpCard from './SignUpCard'
import ProfileCard from './ProfileCard'
import LoginCard from './LoginCard'
import LoginSignupTabs from './LoginSignupTabs'



import {attemptSignup, logout, attemptLogin, showLoginCard, showSignupCard} from 'actions/auth'

class AuthContainer extends Component {

  showProfile = () => {
    if (this.props.user['id_token']) {
      return (
        <ProfileCard
          logout={this.props.logout}
          user={this.props.user}
        />
      )
    }
    if (!this.props.user['id_token'] && this.props.loginCardShowing){
      return (
        <LoginCard
          attemptLogin={this.props.attemptLogin}
          awaitingLoginResponse={this.props.awaitingLoginResponse}
          loginError={this.props.loginError}
        />
      )
    }
    if (!this.props.user['id_token'] && this.props.signupCardShowing) {
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

  showTabs = () => {
    if (!this.props.user['id_token']) {
      return (
        <LoginSignupTabs
          showSignupCard={this.props.showSignupCard}
          showLoginCard={this.props.showLoginCard}
          loginCardShowing={this.props.loginCardShowing}
          signupCardShowing={this.props.signupCardShowing}
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
        {this.showTabs()}
        <div
          style={{
            margin: '5px'
          }}
        >
          {this.showProfile()}
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
    loginCardShowing: state.ui.loginCardShowing,
    signupCardShowing:state.ui.signupCardShowing,
    loginError: state.ui.loginError,
    signupError: state.ui.signupError,
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
    showSignupCard: () => {
      dispatch(showSignupCard())
    },
    showLoginCard: () => {
      dispatch(showLoginCard())
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
