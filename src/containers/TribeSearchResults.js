import React, {Component} from 'react'
import Relay from 'react-relay'
import {List} from 'styled/list'
import {SearchUser} from 'styled/Tribe'
import CreateFriendRequest from 'mutations/CreateFriendRequest'

class TribeSearchResults extends Component {


  createFriendRequest = (recipientId) => {
    let {id: actorId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new CreateFriendRequest({ actorId, recipientId, }), {
        onSuccess: res => console.log('CFQ success', res),
        onFailure: res => console.log('CFQ FAIL', res)
      }
    )
  }

  get results () {
    return this.props.viewer.allUsers.edges.map(edge => {
      let {node: user} = edge
      return (
        <SearchUser
          key={user.id}
          user={user}
          createFriendRequest={()=>this.createFriendRequest(user.id)}
        />
      )
    })
  }

  render () {
    return ( <List> {this.results} </List>
    )
  }
}

export default Relay.createContainer(
  TribeSearchResults, {
    initialVariables: {
      theirHandle: '',
      tribeFilter: {}
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $theirHandle) {
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
                score
              }
            }
          }
        }
      `,
    }
  }
)
