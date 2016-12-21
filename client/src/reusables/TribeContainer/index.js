import React, { Component } from 'react'
import Relay from 'react-relay'
import TribeListItem from 'reusables/TribeListItem'
import styled from 'styled-components'
import {btMedium, btBlack} from 'styling/T'
import {Link} from 'react-router'
import EditFriendRequestMutation from 'mutations/EditFriendRequestMutation'
import AddToFriendsMutation from 'mutations/AddToFriendsMutation'


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
  align-items: center;
  width: 33%;
`

const TribeList = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

`

const TribeHeaderText = styled.li`
  color: ${props=> props.active ? btBlack : btMedium };
  text-decoration: ${props=> props.active ? 'underline' : 'none' };
  cursor: pointer;
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
      user
    } =  this.props
    switch (router.location.pathname) {
      case `/${router.params.handle}/tribe/find`:{
        return this.props.viewer.allUsers.edges.map(edge => (
          <TribeListItem
            key={edge.node.id}
            user={edge.node}
            profilePicUrl={edge.node.profilePicUrl}
            makeTribeRequest={this.handleTribeshipInvitation}
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
              pending
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
              makeTribeRequest={this.handleTribeshipInvitation}
              myTribe
            />
          ))
        } else {
          return <h4>Start building your tribe.</h4>
        }
      }
    }

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
    console.log(user.friends)
    return (
      <section>

        <TribeHeader>
          <TribeHeaderText
            active={(router.params.list === ' ')}
          >
            <Link
              to={`/${router.params.handle}/tribe`}
            >
              <h2>My Tribe</h2>
            </Link>
          </TribeHeaderText>
          <TribeHeaderRight>
            <TribeHeaderText
              active={(router.params.list === 'requests')}
            >
              <Link
                to={`/${router.params.handle}/tribe/requests`}
              >
                <h4>Requests</h4>
              </Link>
              <h4>Pending Requests</h4>
            </TribeHeaderText>
            <TribeHeaderText
              active={(router.params.list === 'find')}
            >
              <Link
                to={`/${router.params.handle}/tribe/find`}
              >
                <h4>Find</h4>
              </Link>
            </TribeHeaderText>
          </TribeHeaderRight>


        </TribeHeader>

        <Search>

        </Search>

        <TribeList>
          {this.userList}
        </TribeList>
      </section>
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
                }
              }
            }
          }
        }
      `,
      viewer: () => Relay.QL`
        fragment on Viewer {
          allUsers (first: 2147483647) {
            edges {
              node {
                name
                id
                profilePicUrl
                handle
              }
            }
          }
        }
      `,
    },
  }
)
