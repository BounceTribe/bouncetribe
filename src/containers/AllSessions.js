import React, {Component} from 'react'
import Relay from 'react-relay'
import {View } from 'styled'


class AllSessions extends Component {


  render() {
    return (
      <div>
        hello
      </div>
    )
  }
}


export default Relay.createContainer(
  AllSessions, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
        }
      `
    }
  }
)
