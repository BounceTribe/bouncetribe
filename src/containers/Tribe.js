import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, IconTextContainer, IconText} from 'styled'
import {Header, HeaderOptions} from 'styled/list'
import {purple, white} from 'theme'
import AddFriend from 'icons/AddFriend'
import TribeIcon from 'icons/Tribe'
import {Panel} from 'components/Panel'

class Tribe extends Component {

  componentWillMount() {
    let {location, userHandle} = this.props

    if (location.pathname === `/tribe/${userHandle}/requests`) {
      this.setState({ tab: 'requests' })
    } else (
      this.setState({ tab: 'members' })
    )
  }

  setTab = (tab, handle) => {
    this.props.router.push(`/tribe/${handle}/${tab}`)
    this.setState({ tab })
  }

  render () {
    console.log('tribeprops', this.props);
    let {User, user} = this.props.viewer
    let person = (User) ? (User) : (user)
    let {handle} = person
    let tab = this.state.tab
    let top = (
      <Header>
        <IconTextContainer to={`/tribe/${handle}`} >
          <TribeIcon fill={purple} />
          <IconText>
            {(user.id === User.id) ? 'My Tribe' : `${User.name}'s Tribe'`}
          </IconText>
        </IconTextContainer>
        <HeaderOptions>
          <Button
            to={{
              pathname: `/tribe/${handle}/find/`,
              query: { ownId: user.id },
            }}
            icon={ <AddFriend fill={white} /> }
            label={'Add Members'}
            primary
          />
        </HeaderOptions>
      </Header>
    )
    return (
      <View hideBorder>
        <Panel
          style={{border: 'none'}}
          tab={tab}
          topBar={top}
          tabChange={(tab)=>this.setTab(tab, this.props.userHandle)}
          labels={['members', 'requests', 'messages']}
          values={[User.friends.count, user.invitations.count, 0]}
          locks={[false, User.id!==user.id, true]}
          content={this.props.children}
        />
      </View>
    )
  }
}

export default Relay.createContainer(
  Tribe, {
    initialVariables: { userHandle: '' },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            invitations (
              filter: {
                accepted: false
                ignored: false
              }
            ) { count }
            friends { count }
           }
          User (handle: $userHandle) {
            handle
            id
            email
            friends { count }
          }
        }
      `,
    }
  }
)
