import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, IconTextContainer, IconText} from 'styled'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Container, Header, HeaderOptions} from 'styled/list'
import {purple, white} from 'theme'
import AddFriend from 'icons/AddFriend'
import TribeIcon from 'icons/Tribe'
import Notifications from 'icons/Notifications'

class Tribe extends Component {

  componentWillMount() {
    let {location, userHandle} = this.props

    if (location.pathname === `/${userHandle}/tribe/requests`) {
        this.setState({
          tab: 1
        })
    } else (
      this.setState({
        tab: 0
      })
    )
  }

  render () {
    let {User, user} = this.props.viewer
    let person = (User) ? (User) : (user)
    let {handle} = person
    let {router} = this.props
    return (
      <View>
        <Container>
          <Header>
            <IconTextContainer
              to={`/${handle}/tribe`}
            >
              <TribeIcon
                fill={purple}
              />
              <IconText>
                {(user.id === User.id) ? 'My Tribe' : `${User.name}'s Tribe'`}
              </IconText>
            </IconTextContainer>
            <HeaderOptions>
              <Button
                to={{
                  pathname: `/${handle}/tribe/find/`,
                  query: {
                    ownId: user.id
                  },
                }}
                icon={
                  <AddFriend
                    fill={white}
                  />
                }
                label={'Add Members'}
                primary
              />
            </HeaderOptions>
          </Header>
          <Tabs
            style={{
              width: '90%',
              margin: '60px 0px'
            }}
            inkBarStyle={{
              backgroundColor: purple
            }}
            value={this.state.tab}
          >
            <Tab
              label={'Members'}
              value={0}
              onActive={()=>{
                router.push(`/${handle}/tribe`)
                this.setState({
                  tab: 0
                })
              }}
            />
            <Tab
              icon={(
                <Notifications
                  notifications={person.invitations.edges.length}
                />
              )}
              label={'Requests'}
              value={1}
              onActive={()=>{
                router.push(`/${handle}/tribe/requests`)
                this.setState({
                  tab: 1
                })
              }}
            />
            <Tab
              label={'Messages (coming soon)'}
              value={2}
              disabled={true}
              style={{
                cursor: 'not-allowed'
              }}
            />
          </Tabs>
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
            invitations (
              filter: {
                accepted: false
                ignored: false
              }
              first: 2147483647
              orderBy: createdAt_ASC
            ) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `,
    }
  }
)
