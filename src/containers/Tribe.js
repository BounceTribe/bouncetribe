import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import {Container, Header, HeaderOptions, Title} from 'styled/list'

class Tribe extends Component {
  render () {
    return (
      <View>
        <Container>
          <Header>
            <Title
              to={`/${this.props.viewer.User.handle}/tribe`}
            >
              Tribe
            </Title>
            <HeaderOptions>

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
