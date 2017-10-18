import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, IconTextContainer, IconText, BtTextMarker} from 'styled'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Container, Header, HeaderOptions} from 'styled/list'
import {purple, white} from 'theme'
import AddFriend from 'icons/AddFriend'
import TribeIcon from 'icons/Tribe'
import {TabLabel} from 'styled'
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
    let {User, user} = this.props.viewer
    let person = (User) ? (User) : (user)
    let {handle} = person
    let {router} = this.props
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
      <View>
          <Panel
            style={{
              width: '90%',
              margin: '60px 0px',
              border: 'none'
            }}
            tab={tab}
            topBar={top}
            tabChange={(tab)=>this.setTab(tab)}
            labels={['members', 'requests', 'messages']}
            locks={[false, false, true]}
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
          user { id }
          User (handle: $userHandle) {
            handle
            id
            email
            invitations (
              filter: {
                accepted: false
                ignored: false
              }
              first: 999
              orderBy: createdAt_ASC
            ) {
              edges {
                node { id }
              }
            }
          }
        }
      `,
    }
  }
)
