import React, { Component } from 'react'
import Relay from 'react-relay'



class FeedContainer extends Component {



  render() {
    console.log(this.props.user)
    return (
      <div>
        <h3>Hi This is feed container</h3>
      </div>
    )
  }
}

export default Relay.createContainer(
  FeedContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          friends (
            first: 2147483647
          ) {
            edges {
              node {
                projects (
                  first: 2
                  orderBy: updatedAt_ASC
                ) {
                  edges {
                    node {
                      title
                    }
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
