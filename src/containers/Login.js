import React, {Component} from 'react'
import Relay from 'react-relay'
import {Background, Container, Lock, Header} from 'styled/Login'
import Logo from 'icons/Logo'
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

          <Header>
            <b>Bounce</b>Tribe
          </Header>

          <Lock
            id='lock'
          />

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
