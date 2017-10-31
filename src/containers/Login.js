import React, {Component} from 'react'
import Relay from 'react-relay'
import {Background, Container, Lock, Header, Legal, LegalLink, LogoImg} from 'styled/Login'
// import Logo from 'icons/Logo'
import LoginLogo from 'icons/LoginLogo.png'
// import {purple} from 'theme'
import {url} from 'config'

class Login extends Component {

  componentDidMount() {
    let user = this.props.viewer.user
    if (user) {
      this.toSite(user)
    } else {
      this.props.route.auth.showLock(false)
    }
  }

  componentWillReceiveProps (newProps) {
    let user = newProps.viewer.user
    if (user) {
      this.toSite(user)
    }
  }

  toSite = (user) => {
    let redirect = localStorage.getItem('redirect')
    redirect && localStorage.removeItem('redirect')
    this.props.router.push(`${redirect || ''}/`)
  }

  render () {
    return (
      <Background>
        <Container>
          <LogoImg src={`${url}/logo.png`} />
          {/* <Logo
            style={{
              display: 'flex',
              backgroundColor: purple,
              height: '70px',
              width: '70px',
              borderRadius: '70px',
              padding: '10px'
            }}
            fill={'white'}
          /> */}
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
            id
          }
        }
      `,
    },
  }
)
