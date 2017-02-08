import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {View, IconText, IconTextContainer, Button} from 'styled'
import {Container, Header, HeaderOptions} from 'styled/list'
import Tribe from 'icons/Tribe'
import {purple, fbBlue, white} from 'theme'
import {FindH3} from 'styled/Tribe'
import Facebook from 'icons/Facebook'
import {fbId} from 'config/facebook'

class TribeFind extends Component {

  share = () => {
    window.open(
      `http://www.facebook.com/dialog/send?
      app_id=${fbId}
      &link=http://www.bouncetribe.com
      &redirect_uri=http://www.bouncetribe.com`,
      '_blank',
      '',
      ''
    )
  }

  connect = () => {
    let {router} = this.props
    router.push('/connect')
  }

  render () {
    let {router, userHandle, viewer} = this.props
    let {user} = viewer
    return (
      <View>
        <Container>
          <Header>
            <IconTextContainer>
              <Tribe
                fill={purple}
              />
              <IconText>
                Add to Tribe
              </IconText>
            </IconTextContainer>
            <HeaderOptions>
              <Button
                label={(user.facebookId) ? 'Invite Facebook Friends' : 'Connect Facebook'}
                labelColor={white}
                backgroundColor={fbBlue}
                onClick={(user.facebookId) ? this.share : this.connect}
                icon={
                  <Facebook
                    fill={white}
                  />
                }
              />
            </HeaderOptions>
          </Header>

          <FindH3>
            Search
            <TextField
              label={'Search'}
              name={'search'}
              onChange={(event, newValue) => router.replace({
                query: {
                  handle: newValue,
                  ownId: user.id
                },
                pathname: `/${userHandle}/tribe/find/`
              })}
            />
          </FindH3>

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
            facebookId
            auth0UserId
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
