import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'

class Project extends Component {
  render () {
    console.log(this.props.viewer)
    return (
      <View>
        <h1>Project</h1>
      </View>
    )
  }
}

export default Relay.createContainer(
  Project, {
    initialVariables: {
      userHandle: '',
      projectTitle: '',
      projectFilter: {}
    },
    prepareVariables: (prevVar)=>{
      return {
        ...prevVar,
        projectFilter: {
          title: prevVar.projectTitle,
          creator: {
            handle: prevVar.userHandle
          }
        }
      }
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $userHandle) {
            id
            email
          }
          allProjects (
            first: 1
            filter: $projectFilter
          ) {
            edges {
              node {
                title
                description
                privacy
                creator
                genre
                artwork {
                  url
                }
                new
                tracks (
                  first: 1
                ) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }
  }
)
