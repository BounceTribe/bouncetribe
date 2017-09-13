import React, {Component} from 'react'
import Relay from 'react-relay'
import {List} from 'styled/list'
import {RequestUser} from 'styled/Tribe'
import UpdateFriendRequest from 'mutations/UpdateFriendRequest'
import AddToFriends from 'mutations/AddToFriends'

class TribeRequests extends Component {

  accept = (inviteId, newFriendId) => {
    let {id: selfId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new UpdateFriendRequest({
        id: inviteId,
        accepted: true
      }), {
        onSuccess: (response) => {
          this.props.relay.commitUpdate(
            new AddToFriends({
              selfId,
              newFriendId
            })
          )
        }
      }
    )
  }

  ignore = (id) => {
    this.props.relay.commitUpdate(
      new UpdateFriendRequest({
        id,
        ignored: true
      })
    )
  }

  get requests() {

    return this.props.viewer.user.invitations.edges.map(edge => {
      let {actor:user, id} = edge.node
      return (
        <RequestUser
          key={user.id}
          user={user}
          accept={()=>this.accept(id, user.id)}
          ignore={()=>this.ignore(id)}
        />
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
              first: 999
              orderBy: createdAt_ASC
            ) {
              edges {
                node {
                  id
                  actor {
                    handle
                    id
                    portrait {
                      url
                    }
                    score
                    placename
                    friends (first: 999) {
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
