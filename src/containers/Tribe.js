import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import {Container, Header, HeaderOptions, Title} from 'styled/list'

class Tribe extends Component {
  render () {
    let {User, user} = this.props.viewer
    let person = (User) ? (User) : (user)
    return (
      <View>
        <Container>
          <Header>
            <Title
              to={`/${person.handle}/tribe`}
            >
              Tribe
            </Title>
            <HeaderOptions>
              <Title
                to={`/${person.handle}/tribe/requests`}
              >
                Requests
              </Title>
              <Title
                to={`/${person.handle}/tribe/find`}
              >
                Find
              </Title>
            </HeaderOptions>
          </Header>
          {this.props.children}
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer(
  Tribe, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $userHandle) {
            handle
            id
            email
          }
        }
      `,
    }
  }
)
