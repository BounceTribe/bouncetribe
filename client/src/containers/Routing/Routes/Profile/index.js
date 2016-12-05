import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileContainer from 'reusables/ProfileContainer'

class Profile extends Component {
  // constructor() {
  //   super()
  //
  // }

  render() {
    console.log(this.props.viewer)
    return (
      <section>
        <h1>Profile</h1>
        <h4>{this.props.viewer.self.handle}</h4>
        <ProfileContainer
          self={this.props.viewer.self}
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
          self {
            personID
            email
            name
            handle
            profilePicUrl
            influences
            ${ProfileContainer.getFragment('self')}
          }
        }
      `,
    },
  }
)
