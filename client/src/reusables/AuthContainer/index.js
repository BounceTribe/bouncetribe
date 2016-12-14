import React, {Component} from 'react'
import {connect} from 'react-redux'
import SignupCard from './SignupCard'
import Relay from 'react-relay'
import ProfileCard from './ProfileCard'
import LoginCard from './LoginCard'
import LoginSignupTabs from './LoginSignupTabs'
import {profileRoute, profileOptions} from 'config/auth0'
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


  socialLogin = async () => {
    const location = this.props.router.location
    if (location.pathname === '/login/social/') {
      console.log(location.hash)
      const idToken = location.hash.split('id_token=')[1].split('&')[0]
      console.log(idToken)
      let options = profileOptions(idToken)
      let profile = await fetch(profileRoute, options).then(data => data.json()).then(json=>json)
      console.log(profile)

    }
  }

  get showProfile() {
    if (this.props.isLoggedIn) {
      return (
        <ProfileCard
          logout={this.handleLogout}
        />
      )
    } else if (!this.props.isLoggedIn && this.state.loginCardShowing){
      return (
        <LoginCard
          attemptLogin={this.props.attemptLogin}
          loginSuccess={this.props.loginSuccess}
          viewer={this.props.viewer}
          router={this.props.router}
        />
      )
    } else if (!this.props.isLoggedIn && this.state.signupCardShowing) {
      return (
        <SignupCard
          attemptLogin={this.props.attemptLogin}
          attemptSignup={this.props.attemptSignup}
          signupSuccess={this.props.signupSuccess}
          loginSuccess={this.props.loginSuccess}
          viewer={this.props.viewer}
          router={this.props.router}
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
    this.socialLogin()
    return (
      <div

      >
        {this.showTabs}
        <div

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
        }
      `,
    },
  }
)
