import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Container, Header, HeaderOptions, Title} from 'styled/list'
import {purple} from 'theme'

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
            <Title
              to={`/${handle}/tribe`}
            >
              {(user.id === User.id) ? 'My Tribe' : `${User.name}'s Tribe'`}
            </Title>
            <HeaderOptions>

              <Title
                to={{
                  pathname: `/${handle}/tribe/find/`,
                  query: {
                    ownId: user.id
                  },
                }}
              >
                Find
              </Title>
            </HeaderOptions>
          </Header>
          <Tabs
            style={{
              width: '100%'
            }}
            inkBarStyle={{
              backgroundColor: purple
            }}
            value={this.state.tab}
          >
            <Tab
              label={'Members'}
              value={0}
              onActive={()=>router.push(`/${handle}/tribe`)}
            />
            <Tab
              label={'Requests'}
              value={1}
              onActive={()=>router.push(`/${handle}/tribe/requests`)}
            />
            <Tab
              label={'Messages'}
              value={2}
              disabled={true}
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
          }
        }
      `,
    }
  }
)
