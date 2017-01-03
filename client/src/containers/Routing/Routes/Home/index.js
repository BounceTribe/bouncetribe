import React, {Component} from 'react'
import Relay from 'react-relay'
import {connect} from 'react-redux'
import Feed from './Feed'
import AuthContainer3 from 'reusables/AuthContainer3'
import {logout} from 'actions/auth'
import {FeedAuthSection} from 'styling/styled'

class Home extends Component {

  get showFeedOrAuth() {
    if (this.props.isLoggedIn) {
      return (
        <Feed
          logout={this.props.logout}
          isLoggedIn={this.props.isLoggedIn}
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


const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth['id_token'],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout())
    },
  }
}

Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

export default Relay.createContainer(
  Home,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          ${AuthContainer3.getFragment('viewer')}
          ${Feed.getFragment('viewer')}
        }
      `,
    },
  }
)
