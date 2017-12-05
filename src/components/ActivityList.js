import React from 'react'
import {Activity, ScrollBox} from 'styled/ActivitiesList'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {purple} from 'theme'

const generateLink = (project) => (
  project.privacy==='PUBLIC' &&
  !project.creator.deactivated &&
  `/${project.creator.handle}/${project.title}`
 )

const makeList = (props) => {
  let {comments, bounces, projects} = props
  let commentProjects = []
  let list = comments.edges.map((edge, index) => {
    let project = edge.node.project || {}
    if (commentProjects.includes(project.id)) {
      console.log('duplicate project ignored')
      return <div key={index}/>
    } else {
      commentProjects.push(project.id)
      return project.id &&
      <Activity
        key={edge.node.id}
        date={edge.node.createdAt}
        icon={<Tribe height={13}/>}
        text={`Gave Feedback to ${project.title}`}
        link={generateLink(project)}/>}
  })
  list = list.concat(bounces.edges.map(edge =>
    <Activity
      key={edge.node.id}
      date={edge.node.createdAt}
      icon={<Bounce width={19} fill={purple}/>}
      text={`Bounced ${edge.node.project.title}`}
      link={generateLink(edge.node.project)}/>
  ))
  list = list.concat(projects.edges.map(edge =>
    <Activity
      key={edge.node.id}
      date={edge.node.createdAt}
      icon={<Music height={13}/>}
      text={`Added a new Project - ${edge.node.title}`}
      link={generateLink(edge.node)}/>
  ))
  return list.sort( (a,b) => (new Date(b.props.date) - new Date(a.props.date)))
}

export const ActivityList = (props) => (
  <ScrollBox> {makeList(props)} </ScrollBox>
)
