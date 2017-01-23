import React, {Component} from 'react'
import Relay from 'react-relay'
import {List, Item2} from 'styled/list'

class TribeRequests extends Component {

  get requests() {
    return this.props.viewer.user.invitations.edges.map(edge => {
      let {node:request} = edge
      return (
        <Item2
          key={request.id}
        >
          {request.name}
        </Item2>
      )
    })
  }

  render () {
    return (
      <List>
        {this.requests}
      </List>
    )
  }
}

export default Relay.createContainer(
  TribeRequests, {
    initialVariables: {
      ownHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            invitations (
              filter: {
                accepted: false
                ignored: false
              }
              first: 2147483647
              orderBy: createdAt_ASC
            ) {
              edges {
                node {
                  id
                  actor {
                    handle
                    id
                    portrait
                    placename
                    friends (first: 2147483647) {
                      edges {
                        node
                      }
                    }
                  }
                }
              }
            }
          }
          User (handle: $ownHandle) {
            id
            email
          }
        }
      `,
    }
  }
)
