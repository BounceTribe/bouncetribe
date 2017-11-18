import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectListSm} from 'components/ProjectListSm'
import Music from 'icons/Music'
import {EmptyPanel} from 'components/EmptyPanel'

class ProjectsPanel extends Component {
  render () {
    let {user, User} = this.props.viewer
    let hasProjects = !!User.projects.length

    return (
      hasProjects ? <ProjectListSm {...this.props} /> :
      <EmptyPanel
        icon={<Music height={93} fill={"#D3D3D3"} />}
        headline={`Everyone wants to hear it`}
        note={`Upload your first project!`}
        btnLabel={`New Project`}
        btnClick={()=>this.props.router.push(`/projects/${user.handle}/new`)}
      />
    )
  }
}

export default Relay.createContainer(
  ProjectsPanel, {
    initialVariables: { userHandle: '' },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $userHandle) {
            id
            handle
            projects (
              first: 999
              orderBy: createdAt_ASC
            ){
              edges {
                node {
                  id
                  title
                  createdAt
                  bounces (first:999) {
                    edges {
                      node {id}
                    }
                  }
                  artwork { url }
                  privacy
                  creator {handle}
                  comments ( first: 999 ) {
                    edges {
                      node {
                        type
                      }
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
