import React, {Component} from 'react'
import Relay from 'react-relay'
import Feed from './Feed'
import AuthContainer3 from 'reusables/AuthContainer3'
import {FeedAuthSection} from 'styling/styled'

class Home extends Component {

  get showFeedOrAuth() {
    if (this.props.viewer.user) {
      return (
        <Feed
          logout={this.props.logout}
          viewer={this.props.viewer}
        />
      )
    } else {
      return (
        <AuthContainer3
          viewer={this.props.viewer}
          router={this.props.router}
          auth={this.props.route.auth}
        />
      )
    }
  }

  render() {
    return (
      <FeedAuthSection>
        {this.showFeedOrAuth}
      </FeedAuthSection>
    )
  }
}

export default Relay.createContainer(
  Home,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          ${AuthContainer3.getFragment('viewer')}
          ${Feed.getFragment('viewer')}
        }
      `,
    },
  }
)
