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
  console.log('listprops', props);
  let {comments, bounces, projects, dash} = props
  let commentProjects = []
  let list = comments.map((comment, index) => {
    let project = comment.project || {}
    if (commentProjects.includes(project.id)) {
      console.log('duplicate project ignored')
      return <div key={index}/>
    } else {
      commentProjects.push(project.id)
      return project.id &&
      <Activity
        key={comment.id}
        date={new Date(comment.createdAt)}
        icon={<Tribe height={13}/>}
        text={`${dash ? comment.author.handle + ' g' : 'G'}ave feedback to ${project.title}`}
        link={generateLink(project)}/>}
  })
  list = list.concat(bounces.map(bounce =>
    <Activity
      key={bounce.id}
      date={new Date(bounce.createdAt)}
      icon={<Bounce width={19} fill={purple}/>}
      text={`${dash ? bounce.bouncer.handle + ' b' : 'B'}ounced ${bounce.project.title}`}
      link={generateLink(bounce.project)}/>
  ))
  list = list.concat(projects.map(project =>
    <Activity
      key={project.id}
      date={new Date(project.createdAt)}
      icon={<Music height={13}/>}
      text={`${dash ? project.creator.handle + ' a' : 'A'}dded a new Project - ${project.title}`}
      link={generateLink(project)}/>
  ))
  console.log('list', list);
  list = list.filter(item=>!!(item && item.props && item.props.date)).sort( (a,b) => {
    // console.log('BAD DTE', !a.props.date && a.props);
    return b.props.date - a.props.date
  })
  console.log('list', list);
  return list
}

export const ActivityList = (props) => (
  <ScrollBox> {makeList(props)} </ScrollBox>
)
