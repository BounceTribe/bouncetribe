import React, { Component } from 'react'
import Relay from 'react-relay'
import CreateTribeshipMutation from 'mutations/CreateTribeshipMutation'
import TribeListItem from 'reusables/TribeListItem'
import styled from 'styled-components'


const TribeHeader = styled.ul`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const TribeHeaderRight = styled.li`
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

class TribeContainer extends Component {

  constructor(props) {
    super(props)
    this.handleTribeshipInvitation = this.handleTribeshipInvitation.bind(this)
  }


  state = {
    list: 'MY_TRIBE'
  }

  get userList () {

    switch (this.state.list) {
      case 'FIND_TRIBE':{
        return this.props.viewer.allUsers.edges.map(edge => (
          <TribeListItem
            key={edge.node.id}
            user={edge.node}
            makeTribeRequest={this.handleTribeshipInvitation}
          />
        ))
      }
      case 'MY_PENDING': {
        console.log('my_pending', this.myPending)
        if (this.myPending.length > 0) {
          return this.myPending.map(user => (
            <TribeListItem
              key={user.id}
              user={user}
              makeTribeRequest={this.handleTribeshipInvitation}
              pending
            />
          ))
        } else {
          return <h4>No Pending!</h4>
        }
      }
      default:
      case 'MY_TRIBE': {
        console.log('my_tribe', this.myTribe)
        if (this.myTribe.length > 0) {
          return this.myTribe.map(user => (
            <TribeListItem
              key={user.id}
              user={user}
              makeTribeRequest={this.handleTribeshipInvitation}
              myTribe
            />
          ))
        } else {
          return <h4>No tribe!</h4>
        }
      }
    }

  }

  handleTribeshipInvitation = async (fields = {}) => {

    Relay.Store.commitUpdate(
      new CreateTribeshipMutation({
        user: this.props.user,
        otherId: fields.otherId,
      }),
      {
        onSuccess: (success) => console.log('succes', success),
        onFailure: (transaction) => console.log('failure', transaction),
      }
    )
  }

  get myTribe () {
    let allRequestedUsers = this.props.user.party1.edges.map(edge =>edge.node.party2)
    let allPendingUsers = this.props.user.party2.edges.map(edge => edge.node.party1)

    let myTribe = []

    myTribe = allRequestedUsers.filter((value) => {
      if (allPendingUsers.length > 0) {
        let match = allPendingUsers.find((item)=> {
          return item.id === value.id
        })
        if (match) {
          return true
        } else {
          return false
        }

      } else {
        return false
      }
    })

    return myTribe

  }

  get myPending () {
    let myTribe = this.myTribe
    let allPendingUsers = this.props.user.party2.edges.map(edge => edge.node.party1)

    console.log('myTribe', myTribe)
    console.log('allPendingUsers', allPendingUsers)

    let myPending = []

    myPending = allPendingUsers.filter((value) => {
      if (myTribe.length > 0) {
        let match = myTribe.find((item)=> {
          return item.id === value.id
        })
        if (match) {
          return false
        } else {
          return true
        }

      } else {
        return true
      }
    })

    return myPending

  }

  render() {

    return (
      <section>

        <TribeHeader>
          <a
            onClick={()=>{
              this.setState({
                list: 'MY_TRIBE'
              })
            }}
          >
            <h2>My Tribe</h2>
          </a>
          <TribeHeaderRight>
            <a
              onClick={()=>{
                this.setState({
                  list: 'MY_PENDING'
                })
              }}
            >
              <h4>Pending Requests</h4>
            </a>
            <a
              onClick={()=>{
                this.setState({
                  list: 'FIND_TRIBE'
                })
              }}
            >
              <h4>Find</h4>
            </a>
          </TribeHeaderRight>


        </TribeHeader>

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
          ${CreateTribeshipMutation.getFragment('user')}
          party1 (first:1000) {
            edges {
              node {
                party2 {
                  name
                  id
                }
              }
            }
          }
          party2 (first:1000) {
            edges {
              node {
                party1 {
                  name
                  id
                }
              }
            }
          }
        }
      `,
      viewer: () => Relay.QL`
        fragment on Viewer {
          allUsers (first: 1000) {
            edges {
              node {
                name
                id
              }
            }
          }
        }
      `,
    },
  }
)
