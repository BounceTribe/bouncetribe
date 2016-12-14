import React, {Component} from 'react'
import Relay from 'react-relay'
import {connect} from 'react-redux'
import Feed from './Feed'
import AuthContainer2 from 'reusables/AuthContainer2'
import {logout} from 'actions/auth'

class Home extends Component {

  get showFeedOrAuth() {
    if (this.props.isLoggedIn) {
      return (
        <Feed
          logout={this.props.logout}
        />
      )
    } else {
      return (
        <AuthContainer2
          viewer={this.props.viewer}
          router={this.props.router}
        />
      )
    }
  }

  render() {
    return (
      <section>
        {this.showFeedOrAuth}
      </section>
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
          ${AuthContainer2.getFragment('viewer')}
        }
      `,
    },
  }
)
