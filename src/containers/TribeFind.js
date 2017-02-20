import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {View, IconText, IconTextContainer, Button} from 'styled'
import {Container, Header, HeaderOptions} from 'styled/list'
import Tribe from 'icons/Tribe'
import {purple, fbBlue, white} from 'theme'
import {FindH3, SearchUser} from 'styled/Tribe'
import Facebook from 'icons/Facebook'
import {fbId} from 'config/facebook'
import {suggestedFriends} from 'utils/graphql'
import {List} from 'styled/list'
import CreateFriendRequest from 'mutations/CreateFriendRequest'

class TribeFind extends Component {

  state = {
    suggestions: [],
    searching: false
  }

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

  createFriendRequest = (recipientId) => {
    let {id: actorId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new CreateFriendRequest({
        actorId,
        recipientId,
      })
    )
  }

  componentWillMount() {
    this.findFriends()
  }

  findFriends = () => {
    suggestedFriends(this.props.viewer.user.id).then(suggestions=>{
      this.setState((prevState, props)=>{
        let users = suggestions.map(user => (
          <SearchUser
            key={user.id}
            user={user}
            createFriendRequest={()=>this.createFriendRequest(user.id)}
          />
        ))
        console.log(users)
        return {
          suggestions: users
        }
      })
    })
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

          {
            (this.state.suggestions.length > 0) ? (
              <FindH3>
                Facebook Friends
              </FindH3>
            ) : null
          }

          {
            (this.state.suggestions.length > 0) ? (
              <List>
                {this.state.suggestions}
              </List>
            ) : null
          }

          <FindH3>
            Search by Username
            <TextField
              label={'Search'}
              name={'search'}
              onChange={(event, newValue) => {
                router.replace({
                  query: {
                    handle: newValue,
                    ownId: user.id
                  },
                  pathname: `/${userHandle}/tribe/find/`
                })
                this.setState({searching: true})
              }}
              placeholder={'JohnLennon'}
            />
          </FindH3>

          {(this.state.searching) ? this.props.children : null}
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer(
  TribeFind, {
    initialVariables: {
      userHandle: '',
      suggestedFriendsFilter: {}
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
