import React, {Component} from 'react'
import Relay from 'react-relay/classic'
import {ProjectListSm} from 'components/ProjectListSm'
import Music from 'icons/Music'
import {EmptyPanel} from 'components/EmptyPanel'

class ProjectsPanel extends Component {
  render () {
    let {user, User} = this.props.viewer
    let isSelf = user.id===User.id
    let hasProjects = !!User.projects.count

    return (
      hasProjects ? <ProjectListSm {...this.props} /> :
      <EmptyPanel
        icon={<Music height={113} fill={"#D3D3D3"} />}
        headline={isSelf ? `Everyone wants to hear it...` : `${User.handle} has no projects`}
        note={isSelf ? `Upload your first project!` : ``}
        btnLabel={isSelf ? `New Project` : ``}
        btnClick={()=>this.props.router.push(`/projects/${user.handle}/new/`)}
      />
    )
  }
}

export default Relay.createContainer(
  ProjectsPanel, {
    initialVariables: { theirHandle: '', projectsFilter: {} },
    prepareVariables: (urlParams) => {
      return {
        ...urlParams,
        //ensures non-deleted projects as well
        projectsFilter: {privacy_not: 'PRIVATE'},
      }
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $theirHandle) {
            id
            handle
            projects (
              first: 999
              orderBy: createdAt_ASC
              filter: $projectsFilter
            ){
              count
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
                  artworkSmall { url }
                  privacy
                  creator {handle}
                  comments ( first: 999 ) {
                    edges {
                      node { type }
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
