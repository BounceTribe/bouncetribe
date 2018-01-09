import React, {Component} from 'react'
import Relay from 'react-relay/classic'
import {List} from 'styled/list'
import {RequestUser} from 'styled/Tribe'
import UpdateFriendRequest from 'mutations/UpdateFriendRequest'
import {acceptFriendRequest} from 'utils/updateCommits'
class TribeRequests extends Component {

  componentDidMount() {
    if (this.props.params.acceptFriendId) {
      this.props.viewer.user.invitations.edges.some( edge => {
        console.log('edge', edge);
        if (edge.node.actor.id===this.props.params.acceptFriendId) {
          console.log('INVITE MATCH!');
          this.accept(edge.node.id, edge.node.actor.id)
          return true
        }
        return false
      })
    }
  }
  accept = (requestId, newFriendId) => acceptFriendRequest({
    requestId, newFriendId,
    props: this.props,
    successCB: ()=>console.log('success from TR'),
    failureCB: ()=>console.log('failure from TR'),
  })

  // accept = (inviteId, newFriendId) => {
  //   let {id: selfId} = this.props.viewer.user
  //   this.props.relay.commitUpdate(
  //     new UpdateFriendRequest({
  //       id: inviteId,
  //       accepted: true
  //     }), {
  //       onSuccess: (response) => {
  //         this.props.relay.commitUpdate(
  //           new AddToFriends({
  //             selfId,
  //             newFriendId
  //           }), {
  //             onSuccess: (response) => console.log('Accepted and added')
  //           }
  //         )
  //       }
  //     }
  //   )
  // }

  ignore = (id) => {
    this.props.relay.commitUpdate(
      new UpdateFriendRequest({
        id,
        ignored: true
      })
    )
  }

  get requests() {
    return (this.props.viewer.user.invitations.edges || []).map((edge, index) => {
      let {actor:user, id} = edge.node
      return (
        <RequestUser
          key={id}
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
      theirHandle: ''
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
                    friends (
                      first: 999
                      filter: {deactivated: false}
                    ) {
                      edges {
                        node
                      }
                    }
                  }
                }
              }
            }
          }
          User (handle: $theirHandle) {
            id
            email
          }
        }
      `,
    }
  }
)
