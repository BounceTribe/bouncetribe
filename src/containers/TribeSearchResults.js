import React, {Component} from 'react'
import Relay from 'react-relay'
import {List} from 'styled/list'
import {SearchUser} from 'styled/Tribe'

class TribeSearchResults extends Component {


  get results () {
    return this.props.viewer.allUsers.edges.map(edge => (
      <SearchUser
        key={edge.node.id}
        user={edge.node}
      />
    ))
  }

  render () {
    return (
      <List>
        {this.results}
      </List>
    )
  }
}

export default Relay.createContainer(
  TribeSearchResults, {
    initialVariables: {
      userHandle: '',
      tribeFilter: {}
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
          }
          allUsers (
            first: 10
            filter: $tribeFilter
          ) {
            edges {
              node {
                id
                email
                name
                handle
                portrait {
                  url
                }
                placename
              }
            }
          }
        }
      `,
    }
  }
)
