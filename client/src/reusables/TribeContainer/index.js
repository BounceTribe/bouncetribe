import React, { Component } from 'react'
import Relay from 'react-relay'
import TribeListItem from 'reusables/TribeListItem'
import styled from 'styled-components'
import {btBlack, btLight} from 'styling/T'
import {Link} from 'react-router'
import EditFriendRequestMutation from 'mutations/EditFriendRequestMutation'
import AddToFriendsMutation from 'mutations/AddToFriendsMutation'
import CreateFriendRequestMutation from 'mutations/CreateFriendRequestMutation'
import {Section} from 'styling/styled'

import Tribe from 'imgs/icons/tribe'
import AddToTribe from 'imgs/icons/AddToTribe'

import BTButton from 'reusables/BTButton'

const TribeHeader = styled.ul`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  margin: 0 1.2%;
  box-sizing: border-box;
`

const Search = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  margin: 0 1.2%;
  box-sizing: border-box;
`

const TribeHeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: baseline;
`

const TribeList = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: baseline;
  flex-wrap: wrap;

`

const TribeHeaderText = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-content: flex-end;
  align-items: baseline;
`

const MyTribeText = styled.h2`
  color: ${props=> props.active ? btBlack : btLight };
  font-weight: ${props=> props.active ? '400' : '200' };
`
const PendingText = styled.h4`
  color: ${props=> props.active ? btBlack : btLight };
  font-weight: ${props=> props.active ? '400' : '200' };
  font-size: .9em;
  min-width: 150px;
`

const IconContainer = styled.div`
  display: flex;
  align-content: flex-end;
  margin-right: 5px;
  height: 25px;
  width: 25px;
`


class TribeContainer extends Component {

  // constructor(props) {
  //   super(props)
  //   this.handleTribeshipInvitation = this.handleTribeshipInvitation.bind(this)
  // }
  //
  //
  // discover = async() => {
  //
  // }
  //
  get userList () {
    let {
      router,
      user,
      viewer
    } =  this.props
    switch (router.location.pathname) {
      case `/${router.params.handle}/tribe/find`:{

        let allUsers = viewer.allUsers.edges.map(edge=>edge.node)

        let pendingRequests = user.sentRequests.edges.map(edge=>edge.node.recipient)

        let friends = user.friends.edges.map(edge=>edge.node)

        friends.forEach( (friend) => {
          let match = allUsers.findIndex( (person) => {
            return person.id === friend.id
          })
          if (match !== -1) {
            allUsers[match].friend = true
          }
        })

        console.log('pendingRequests', pendingRequests)

        pendingRequests.forEach( (pending) => {
          let match = allUsers.findIndex( (person)=> {
            return person.id === pending.id
          })
          if (match !== -1) {
            allUsers[match].pending = true
          }
        })

        console.log('allUsers', allUsers)

        return allUsers.map(user => (
          <TribeListItem
            key={user.id}
            user={user}
            profilePicUrl={user.profilePicUrl}
            makeTribeRequest={this.newFriendInvite}
            pending={user.pending}
            friend={user.friend}
          />
        ))
      }
      case `/${router.params.handle}/tribe/requests`: {
        if (user.invitations.edges.length > 0) {
          return user.invitations.edges.map(edge => (
            <TribeListItem
              key={edge.node.id}
              id={edge.node.id}
              user={edge.node.actor}
              profilePicUrl={edge.node.actor.profilePicThumb}
              makeTribeRequest={this.respondToFriendRequest}
              request
            />
          ))
        } else {
          return <h4>No invitations right now.</h4>
        }
      }
      default:
      case `/${router.params.handle}/tribe`: {
        if (user.friends.edges.length > 0) {
          return user.friends.edges.map(edge => (
            <TribeListItem
              key={edge.node.id}
              id={edge.node.id}
              user={edge.node}
              profilePicUrl={edge.node.profilePicThumb}
              myTribe
            />
          ))
        } else {
          return <h4>Start building your tribe.</h4>
        }
      }
    }

  }

  newFriendInvite = async (fields = {}) => {
    Relay.Store.commitUpdate(
      new CreateFriendRequestMutation({
        actorId: this.props.user.id,
        recipientId: fields.recipientId
      }),
      {
        onSuccess: (transaction) => {
          console.log('makeTribeRequest succeeded', transaction)
        },
        onFailure: (transaction) => {
          console.log('makeTribeRequest failed', transaction)
        }
      }
    )

  }

  respondToFriendRequest = async (fields = {}) => {
    Relay.Store.commitUpdate(
      new EditFriendRequestMutation({
        id: fields.id,
        accepted: fields.accepted,
        ignored: fields.ignored
      }),
      {
        onSuccess: (transaction) => {
          console.log('EditFriendRequestMutation succeeded', transaction)
          if (fields.accepted) {
            Relay.Store.commitUpdate(
              new AddToFriendsMutation({
                selfId: this.props.user.id,
                newFriendId: fields.newFriendId,
              }),
              {
                onSuccess: ()=>{
                },
                onFailure: (transaction) => {
                  console.log('AddToFriends failed', transaction)
                },
              }
            )
          }
        },
        onFailure: (transaction) => {
          console.log('respondToFriendRequest failed', transaction)
        }
      }
    )

  }


  render() {
    let {
      router,
      user
    } = this.props
    return (
      <Section>

        <TribeHeader>
            <Link
              to={`/${router.params.handle}/tribe`}
            >
              <TribeHeaderText>
                <IconContainer>
                  <Tribe/>
                </IconContainer>
                <MyTribeText
                  active={(router.location.pathname === `/${router.params.handle}/tribe`)}
                >
                  My Tribe
                </MyTribeText>
            </TribeHeaderText>
            </Link>
          <TribeHeaderRight>

              <Link
                to={`/${router.params.handle}/tribe/requests`}
              >
                <PendingText
                  active={(router.location.pathname === `/${router.params.handle}/tribe/requests`)}
                >
                  Pending Requests ({user.invitations.edges.length})
                </PendingText>
              </Link>
              <Link
                to={`/${router.params.handle}/tribe/find`}
              >
                <BTButton
                  text={'Add members'}
                  flex
                  icon={AddToTribe}
                />
              </Link>
          </TribeHeaderRight>


        </TribeHeader>

        <Search>

        </Search>

        <TribeList>
          {this.userList}
        </TribeList>
      </Section>
    )
  }
}


export default Relay.createContainer(
  TribeContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          email
          name
          profilePicUrl
          handle
          summary
          id
          friends (first: 2147483647) {
            edges {
              node {
                id
                handle
                profilePicThumb
                profilePicUrl
                placename
                friends (first: 2147483647) {
                  edges {
                    node
                  }
                }
              }
            }
          }
          sentRequests (
            filter: {
              accepted: false
              ignored: false
            }
            first: 2147483647
          ) {
            edges {
              node {
                recipient {
                  id
                }
              }
            }
          }
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
                  profilePicThumb
                  profilePicUrl
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
      `,
      viewer: () => Relay.QL`
        fragment on Viewer {
          allUsers (
            first: 2147483647
          ) {
            edges {
              node {
                id
                profilePicUrl
                profilePicThumb
                handle
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
      `,
    },
  }
)
