import React, {Component} from 'react'
import {connect} from 'react-redux'
import Feed from './Feed'
import Landing from './Landing'

class Home extends Component {

  get showFeedOrLanding() {
    if (this.props.isLoggedIn) {
      return (
        <Feed />
      )
    } else {
      return (
        <Landing />
      )
    }
  }

  render() {
    return (
      <section>
        <h1>Home</h1>
        {this.showFeedOrLanding}
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

  }
}

Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

export default Home
