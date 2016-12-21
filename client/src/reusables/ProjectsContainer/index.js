import React, { Component } from 'react'
import Relay from 'react-relay'


class ProjectsContainer extends Component {


  render() {

    return (
      <div>



      </div>
    )
  }
}

export default Relay.createContainer(
  ProjectsContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          placename
          longitude
          latitude
          website
          experience
          email
          name
          profilePicUrl
          profilePicThumb
          handle
          summary
          id
        }
      `,
    },
  }
)
