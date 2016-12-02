import React, { Component } from 'react'
import Relay from 'react-relay'


class Profile extends Component {
  // constructor() {
  //   super()
  //
  // }

  render() {
    return (
      <section>
        <h1>Profile</h1>
        <h5>Dis ur profile</h5>
      </section>
    )
  }
}


export default Relay.createContainer(
  Profile,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          self (first: 1) {
            edges {
              node {
                personID
                email
                name
                handle
                traits (first: 10) {
                  edges {
                    node {
                      key
                      value
                    }
                  }
                }
              }
            }
          }
          personID
        }
      `,
    },
  }
)
