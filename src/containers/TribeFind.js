import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {View} from 'styled'
import {Container, Header, HeaderOptions, Title} from 'styled/list'

class TribeFind extends Component {


  render () {
    let {router, userHandle, viewer} = this.props
    return (
      <View>
        <Container>
          <Header>
            <Title>
              Add to Tribe
            </Title>
            <HeaderOptions>
              <TextField
                label={'Search'}
                name={'search'}
                onChange={(event, newValue) => router.replace({
                  query: {
                    handle: newValue,
                    ownId: viewer.user.id
                  },
                  pathname: `/${userHandle}/tribe/find/`
                })}
              />
            </HeaderOptions>
          </Header>

          {this.props.children}
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer(
  TribeFind, {
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
            id
            email
          }
        }
      `,
    }
  }
)
