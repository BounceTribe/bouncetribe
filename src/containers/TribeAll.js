import React, {Component} from 'react'
import Relay from 'react-relay'
import {List, Item2} from 'styled/list'

class TribeAll extends Component {

  get friendsList () {
    return this.props.viewer.User.friends.edges.map(edge=>{
      let {node:friend} = edge
      return (
        <Item2
          key={friend.id}
        >
          {friend.name}
        </Item2>
      )
    })
  }

  render () {
    return (
      <List>
        {this.friendsList}
      </List>
    )
  }
}

export default Relay.createContainer(
  TribeAll, {
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
            id
            email
            friends (
              first: 20
            ) {
              edges {
                node {
                  name
                  id
                }
              }
            }
          }
        }
      `,
    }
  }
)
