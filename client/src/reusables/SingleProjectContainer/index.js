import React, { Component } from 'react'
import Relay from 'react-relay'
// import styled from 'styled-components'
// import ProfileField from 'reusables/ProfileField'
// import {findProjectId} from 'apis/graphql'


class SingleProjectContainer extends Component {

  // getProjectId = async(newParams) => {
  //   try {
  //     let {
  //       title,
  //       handle
  //     } = newParams
  //     let options = findProjectId(handle, title)
  //     const projectId = await fetch(...options).then(resp=>resp.json()).then(json=>json.data.User.projects[0].id)
  //     console.log('projectId', projectId)
  //     this.props.relay.setVariables({
  //       projectId,
  //       projectIdExists: true
  //     })
  //   } catch (error) {
  //     console.log("hello")
  //   }
  // }
  //
  //
  // componentWillReceiveProps (newProps) {
  //   if (!this.props.params.title && newProps.params.title) {
  //     console.log('componentWillReceiveProps')
  //     this.getProjectId(newProps.params)
  //   }
  // }


  render() {
    console.log('singleProjectContainer',this.props)

    return (
      <div>
        {this.props.project.title}
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
