import React, {Component} from 'react'
import Relay from 'react-relay'
import {Activity} from 'styled/ActivitiesList'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {purple} from 'theme'
import {PanelScrollContainer} from 'styled'

class ActiviesPanel extends Component {

  get activities () {
    let {comments, bounces, projects} = this.props.viewer.User
    let commentProjects = []
    let list = comments.edges.map((edge, index) =>{
      let project = edge.node.project || {}
      if (commentProjects.includes(project.id)) {
        console.log('dupe, dupe');
        return <div key={index}/>
      } else {
        commentProjects.push(project.id)
        console.log('project', project);
        return project.id && <Activity
          key={edge.node.id}
          date={edge.node.createdAt}
          icon={<Tribe height={13}/>}
          text={`Gave Feedback to ${project.title}`}
          link={project.privacy==='PUBLIC' && `/${project.creator.handle}/${project.title}`}/>}
    })
    list = list.concat(bounces.edges.map(edge =>
      <Activity
        key={edge.node.id}
        date={edge.node.createdAt}
        icon={<Bounce width={19} fill={purple}/>}
        text={`Bounced ${edge.node.project.title}`}
        link={edge.node.project.privacy==='PUBLIC' && `/${edge.node.project.creator.handle}/${edge.node.project.title}`}/>
    ))
    list = list.concat(projects.edges.map(edge =>
      <Activity
        key={edge.node.id}
        date={edge.node.createdAt}
        icon={<Music height={13}/>}
        text={`Added a new Project - ${edge.node.title}`}
        link={edge.node.privacy==='PUBLIC' && `/${this.props.params.userHandle}/${edge.node.title}`}/>
    ))
    list = list.sort( (a,b) =>
      (new Date(b.props.date) - new Date(a.props.date)) )
    return list
  }

  render () {
    return (
      <PanelScrollContainer>
        <div style={{overflowY: 'scroll', overflowX: 'hidden', width: '100%'}}>
          {this.activities}
        </div>
      </PanelScrollContainer>
    )
  }
}

export default Relay.createContainer( ActiviesPanel, {
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
          comments (
            first: 999
            orderBy: createdAt_ASC
          ){
            edges {
              node {
                id
                createdAt
                project {
                  id
                  title
                  privacy
                  creator {handle}
                }
              }
            }
          }
          bounces (
            first:999
            orderBy: createdAt_ASC
           ) {
            edges {
              node {
                id
                createdAt
                project {
                  id
                  title
                  privacy
                  creator {handle}
                }
              }
            }
          }
          projects (
            first: 999
            orderBy: createdAt_ASC
          ){
            edges {
              node {
                id
                title
                createdAt
                privacy
              }
            }
          }
        }
      }
    `,
  }
}
)
