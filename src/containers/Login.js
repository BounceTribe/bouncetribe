import React, {Component} from 'react'
import Relay from 'react-relay'
import {FeedView} from 'styled'

class Login extends Component {

  componentDidMount() {
    if (this.props.viewer.user) {
      this.props.router.push('/')
    } else {
      this.props.route.auth.showLock()
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.viewer.user) {
      this.props.router.push('/')
    }
  }

  render () {
    return (
      <FeedView>
        <div
          id='lock'
        >

        </div>
      </FeedView>
    )
  }
}

export default Relay.createContainer(
  Login, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
        }
      `,
    },
  }
)
