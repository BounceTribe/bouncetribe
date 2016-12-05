import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileContainer from 'reusables/ProfileContainer'

class Profile extends Component {
  // constructor() {
  //   super()
  //
  // }

  render() {
    return (
      <section>
        <h1>Profile</h1>
        <ProfileContainer
          person={this.props.viewer.self.edges.map((edge) => edge.node).map((person) => person)[0]}
        />
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
                profilePicUrl
                ${ProfileContainer.getFragment('person')}
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
