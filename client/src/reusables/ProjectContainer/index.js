import React, { Component } from 'react'
import Relay from 'react-relay'
// import styled from 'styled-components'
import ProfileField from 'reusables/ProfileField'

class ProjectContainer extends Component {

  render() {

    return (
      <div>

        <ProfileField
          field={'title'}
          label={'title'}
          text={''}
          submitField={this.props.submitField}
          fontSize={.9}
          ownProfile={this.props.ownProfile}
        />

      </div>
    )
  }
}

export default Relay.createContainer(
  ProjectContainer,
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
          projects (first: 2147483647) {
            edges {
              node {
                title
              }
            }
          }
        }
      `,
    },
  }
)
