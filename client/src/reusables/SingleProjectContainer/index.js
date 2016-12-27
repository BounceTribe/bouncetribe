import React, { Component } from 'react'
import Relay from 'react-relay'
// import styled from 'styled-components'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'

class SingleProjectContainer extends Component {

  submitField = () => {
    Relay.Store.commitUpdate(
      new UpdateProjectMutation({
        project: this.props.project,
        title: this.state.title,
        user: this.props.user
      }),
      {
        onSuccess: (success) => {
          console.log('success', success)
          this.props.router.replace({
            pathname: `/${this.props.user.handle}/projects/${success.updateProject.project.title}`
          })
        },
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }

  render() {
    return (
      <div>
        <input
          onChange={(e)=>{
            this.setState({
              title: e.target.value
            })
          }}
        />

        <button
          onClick={this.submitField}
        >
          Submit
        </button>
      </div>
    )
  }
}

export default Relay.createContainer(
  SingleProjectContainer,
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
