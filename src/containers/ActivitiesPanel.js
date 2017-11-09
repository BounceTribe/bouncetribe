import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, IconTextContainer, IconText} from 'styled'
import {Container, Header, NList} from 'styled/list'
import {Activity} from 'styled/ActiviesPanel'
import Alerts from 'icons/Alerts'
import {purple} from 'theme'

class ActiviesPanel extends Component {
  get notifications () {
    let notifications = (this.props.viewer.user || {}).notifications;
    return notifications && notifications.edges.reverse().map( edge => (
      <Activity key={edge.node.id} notification={edge.node} />
    ) )
  }

  render () {
    return (
      <View>
        <Container>
          <Header>
            <IconTextContainer to={`/notifications`} >
              <Alerts fill={purple} />
              <IconText>
                Activitys
              </IconText>
            </IconTextContainer>
          </Header>
          <NList>
            {this.notifications}
          </NList>
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer( ActiviesPanel, {
  initialVariables: { userHandle: '' },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          handle
        }
        User (handle: $userHandle) {
          id
          handle
          bounces ( first:999 ) {
            edges {
              node {
                id
                project {
                  id
                  title
                  createdAt
                  artwork {url}
                  privacy
                  creator {handle}
                  bounces (first: 999) {
                    edges {
                      node {id}
                    }
                  }
                  comments (first: 999){
                    edges {
                      node { type }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  }
}
)
