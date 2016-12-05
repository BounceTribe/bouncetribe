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
          person={this.props.viewer}
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
        fragment on Person {
          personID,
          email,
          name,
          profilePicUrl,
          handle,
          ${ProfileContainer.getFragment('person')}
        }
      `,
    },
  }
)
