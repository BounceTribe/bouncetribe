import React, { Component } from 'react'
import Relay from 'react-relay'
import Project from 'reusables/Project'
import NewProjectCreator from 'reusables/NewProjectCreator'

class SingleProjectContainer extends Component {

  get showProjectOrCreator () {
    if (this.props.project.new) {
      return (
        <NewProjectCreator
          user={this.props.user}
          project={this.props.project}
          router={this.props.router}
        />
      )
    } else {
      return (
        <Project
          user={this.props.user}
          project={this.props.project}
          router={this.props.router}
        />
      )
    }
  }

  render() {
    return (
      <div>

        {this.showProjectOrCreator}
      </div>
    )
  }
}

export default Relay.createContainer(
  SingleProjectContainer, {
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
      project: () => Relay.QL`
        fragment on Project {
          title
          id
          description
          privacy
          new
          artwork {
            url
          }
          tracks (first: 2147483647) {
            edges {
              node {
                url
                id
                visualization
              }
            }
          }
        }
      `,
    },
  }
)
