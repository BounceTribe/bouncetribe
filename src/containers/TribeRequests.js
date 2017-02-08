import React, {Component} from 'react'
import Relay from 'react-relay'
import {List} from 'styled/list'
import {RequestUser} from 'styled/Tribe'

class TribeRequests extends Component {

  get requests() {
    if (this.props.viewer.user.invitations.edges.length < 1) {
      return (
        <h3>No New Requests!</h3>
      )
    } else {
      return this.props.viewer.user.invitations.edges.map(edge => {
        let {node:user} = edge
        return (
          <RequestUser
            key={user.id}
            user={user}
          />
        )
      })
    }
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
      userHandle: ''
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
          User (handle: $userHandle) {
            id
            email
          }
        }
      `,
    }
  }
)
