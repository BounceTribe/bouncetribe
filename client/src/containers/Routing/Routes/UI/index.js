import React, {Component} from 'react'
import TopBar from './TopBar'
import {connect} from 'react-redux'

class UI extends Component {
  render() {
    return (
        <div>
          <TopBar
            isLoggedIn={this.props.isLoggedIn}
            router={this.props.router}
          />
          <main>
            {this.props.children}
          </main>
        </div>
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

UI = connect(
  mapStateToProps,
  mapDispatchToProps
)(UI)

export default UI
