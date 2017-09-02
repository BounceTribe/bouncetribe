import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, IconTextContainer, IconText} from 'styled'
import {Container, Header, NList} from 'styled/list'
import {Notification} from 'styled/NotificationList'
import Alerts from 'icons/Alerts'
import {purple} from 'theme'


class NotificationList extends Component {
  get notifications () {
    console.log('noti props', this.props);
    return this.props.viewer.User.notifications.edges.map( edge => (
      <Notification
        key={edge.node.id}
        notification={edge.node} />
      ) )
  }

  render () {
    console.log('notifications', this.notifications);
    return (
      <View>
        <Container>
          <Header>
            <IconTextContainer
              to={`/${this.props.viewer.User.handle}/notificationPage`}
            >
              <Alerts fill={purple} />
              <IconText>
                Notifications
              </IconText>
            </IconTextContainer>
          </Header>
          <NList className="nlist">
            {this.notifications}
          </NList>
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer(
  NotificationList, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $userHandle) {
            handle
            id
            email
            notifications (first: 20) {
              edges {
                node {
                  checked
                  createdAt
                  id
                  triggeredBy {
                    id
                    handle
                  }
                  notificationFor {
                    id
                    handle
                  }
                  project
                  session
                  type
                }
              }
            }
          }
        }
      `,
    }
  }
)
