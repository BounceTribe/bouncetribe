import React, {Component} from 'react'
import S from 'styling/S'

const tabBase = {
  display: 'flex',
  width: '50%',
  minHeight: '2em',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'grey'
}

const tabStyle = new S({
  base: tabBase
})

class LoginSignupTabs extends Component {
  constructor(props) {
    super(props)
    this.showSignupCard = this.props.showSignupCard.bind(this)
    this.showLoginCard = this.props.showLoginCard.bind(this)
  }

  signupTabActive = () => {
    if (this.props.signupCardShowing) {
      return {
        backgroundColor: 'white',
        fontWeight: 'bold'
      }
    }
  }

  loginTabActive = () => {
    if (this.props.loginCardShowing) {
      return {
        backgroundColor: 'white',
        fontWeight: 'bold'
      }
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          borderBottom: 'solid black 1px'
        }}
      >
        <a
          onClick={this.showLoginCard}
          style={{
            ...tabStyle.all,
            ...this.loginTabActive()
          }}
        >

          Login
        </a>
        <a
          onClick={this.showSignupCard}
          style={{
            ...tabStyle.all,
            ...this.signupTabActive()
          }}
        >
          Signup
        </a>
      </div>
    )
  }
}



export default LoginSignupTabs
