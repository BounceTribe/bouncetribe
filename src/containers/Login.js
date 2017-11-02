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
    user ? this.toSite(user) : this.props.route.auth.showLock(false)

  }

  componentWillReceiveProps (newProps) {
    if (!this.state.routeSet) {
      let user = newProps.viewer.user
      if ((user || {}).id) this.toSite(user)
    }
  }

  toSite = (user) => {
    let redirect = localStorage.getItem('redirect')
    let friends = user.friends.edges
    if (redirect) {
      localStorage.removeItem('redirect')
      this.props.router.push(`${redirect}`)
      this.setState({routeSet: true})
    } else if (friends.length) {
      this.props.router.push(`/dash/${friends[0].node.handle}/projects`)
      this.setState({routeSet: true})
    } else {
      //for new users/no friends
      this.props.router.push(`/${user.handle}/profile`)
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
