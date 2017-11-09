import React, {Component} from 'react'
import Relay from 'react-relay'
import {Background, Container, Lock, Header, Legal, LegalLink, LogoImg} from 'styled/Login'
import LoginLogo from 'icons/LoginLogo.png'
import {url} from 'config'

class Login extends Component {

  state={ routeSet: false }

  componentDidMount() {
    console.log('login redirect:', localStorage.getItem('redirect'))
    let user = this.props.viewer.user
    console.log('login user', user);
    user ? this.toSite(user) : this.props.route.auth.showLock(false)

  }

  componentWillReceiveProps (newProps) {
    if (!this.state.routeSet) {
      let user = newProps.viewer.user
      if (user) this.toSite(user)
    }
  }

  toSite = (user) => {
    let redirect = localStorage.getItem('redirect')
    // let friends = user.friends.edges
    if (redirect) {
      console.log('Login.js - localstorage redirect and this', redirect, this);
      localStorage.removeItem('redirect')
      this.props.router.push(redirect)
      this.setState({routeSet: true})
    } else {
      this.props.router.push(`/dash/`)
      this.setState({routeSet: true})
    }
  }

  render () {
    return (
      <Background>
        <Container>
          <LogoImg src={`${url}/logo.png`} />
          <Header src={LoginLogo} />
          <Lock id='lock' />
          <Legal>
            <LegalLink href={"http://bouncetribe.com/terms-of-service/"} >
              Our Terms
            </LegalLink>
              &nbsp;&&nbsp;
            <LegalLink href={"http://bouncetribe.com/privacy-policy/"} >
               Privacy Policy
            </LegalLink>
          </Legal>
        </Container>
      </Background>
    )
  }
}

export default Relay.createContainer(
  Login, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            handle
            id
            friends (first: 1) {
              edges {
                node { handle }
              }
            }
          }
        }
      `,
    },
  }
)
