import React, { Component } from 'react'
import Relay from 'react-relay'
import BTButton from 'reusables/BTButton'
import CreateTribeshipMutation from 'mutations/CreateTribeshipMutation'

class TribeContainer extends Component {

  get userList () {
    return this.props.viewer.allUsers.edges.map(edge => (
      <div
        key={edge.node.id}
      >
        {edge.node.name}
        <BTButton
          text={'Invite'}
          onClick={()=>{
            let fields = {
              user: edge.node
            }
            this.handleTribeshipInvitation(fields)
          }}
        />
      </div>)
    )

  }

  handleTribeshipInvitation = async (fields = {}) => {

    Relay.Store.commitUpdate(
      new CreateTribeshipMutation({
        user: this.props.user,
        party2: fields.user,
      }),
      {
        onSuccess: (success) => console.log('succes', success),
        onFailure: (transaction) => console.log('failure', transaction),
      }
    )
  }

  render() {
    return (
      <section>

        <h3>Find Friends</h3>

        {this.userList}
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
