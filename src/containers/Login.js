import React, {Component} from 'react'
import Relay from 'react-relay'
import {Background, Container, Lock, Header, Legal, LegalLink} from 'styled/Login'
import Logo from 'icons/Logo'
import LoginLogo from 'icons/LoginLogo.png'
import {purple} from 'theme'

class Login extends Component {

  componentDidMount() {
    if (this.props.viewer.user) {
      this.props.router.push('/')
    } else {
      this.props.route.auth.showLock(false)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.viewer.user) {
      this.props.router.push('/')
    }
  }





  render () {
    return (
      <Background>

        <Container>

          <Logo
            style={{
              display: 'flex',
              backgroundColor: purple,
              height: '70px',
              width: '70px',
              borderRadius: '70px',
              padding: '10px'

            }}
            fill={'white'}
          />

          <Header
            src={LoginLogo}
          />

          <Lock
            id='lock'
          />
          <Legal>
            <LegalLink
              href={"http://bouncetribe.com/terms-of-service/"}
            >
              Our Terms
            </LegalLink>
              &nbsp;&&nbsp;
            <LegalLink
              href={"http://bouncetribe.com/privacy-policy/"}
            >
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
