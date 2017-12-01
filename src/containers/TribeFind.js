import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {View, IconText, IconTextContainer, Button} from 'styled'
import {Header, HeaderOptions, List} from 'styled/list'
import Tribe from 'icons/Tribe'
import {purple, fbBlue, white} from 'theme'
import {FindH3, SearchUser} from 'styled/Tribe'
import Facebook from 'icons/Facebook'
import {facebook} from 'config'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'

class TribeFind extends Component {

  state = {
    suggestions: [],
    searching: false
  }

  share = () => {
    window.open(
      `http://www.facebook.com/dialog/send?
      app_id=${facebook.id}
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
    console.log('TF createfriend request')
    let {id: actorId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new CreateFriendRequest({ actorId, recipientId, }), {
        onSuccess: res => console.log('CFQ success', res),
        onFailure: res => console.log('CFQ FAIL', res)
      }
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

        return { suggestions: users }
      })
    })
  }

  render () {
    let {router, theirHandle, viewer} = this.props
    let {user} = viewer
    return (
      <View>
          <Header>
            <IconTextContainer to={`/tribe/${user.handle}`} >
              <Tribe fill={purple} />
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
                icon={ <Facebook fill={white} /> }
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
                router.push({
                  query: {
                    handle: newValue,
                    ownId: user.id
                  },
                  pathname: `/tribe/${theirHandle}/find/`
                })
                this.setState({searching: true})
              }}
              placeholder={'JohnLennon'}
            />
          </FindH3>

          {(this.state.searching) ? this.props.children : null}
      </View>
    )
  }
}

export default Relay.createContainer(
  TribeFind, {
    initialVariables: {
      theirHandle: '',
      suggestedFriendsFilter: {}
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            facebookId
            auth0UserId
            handle
          }
          User (handle: $theirHandle) {
            id
            email
          }
        }
      `,
    }
  }
)
