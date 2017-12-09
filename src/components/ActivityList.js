import React from 'react'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {Activity, ScrollBox} from 'styled/ActivityList'
import {BtAvatar} from 'styled'
import {purple} from 'theme'

const generateLink = (project) => (
  project.privacy==='PUBLIC' &&
  !project.creator.deactivated &&
  `/${project.creator.handle}/${project.title}`
)

const makeList = (props) => {
  // console.log('listprops', props);
  let {comments, bounces, projects, dash} = props

  let commentProjects = []
  let list = comments.map((comment, index) => {
    let project = comment.project || {}
    if (commentProjects.includes(project.id)) {
      // console.log('duplicate project ignored')
      return <div key={index}/>
    } else {
      commentProjects.push(project.id)
      return project.id &&
      <Activity dash={dash}
        key={comment.id}
        date={new Date(comment.createdAt)}
        icon={dash ? <BtAvatar hideOnline size={40} user={comment.author} /> : <Tribe height={13}/>}
        text={`${dash ? comment.author.handle + ' g' : 'G'}ave feedback to ${project.title}`}
        link={generateLink(project)}/>}
  })
  list = list.concat(bounces.map(bounce => {
    return (
    <Activity dash={dash}
      key={bounce.id}
      date={new Date(bounce.createdAt)}
      icon={dash ? <BtAvatar hideOnline size={40} user={bounce.bouncer} /> : <Bounce width={19} fill={purple}/>}
      text={`${dash ? bounce.bouncer.handle + ' b' : 'B'}ounced ${bounce.project.title}`}
      link={generateLink(bounce.project)}/>
    )}
  ))

  list = list.concat(projects.map(project => {
    let link = generateLink(project)
    return (
    <Activity dash={dash}
      key={project.id}
      date={new Date(project.createdAt)}
      icon={dash ? <BtAvatar hideOnline size={40} user={project.creator} /> : <Music height={13}/>}
      text={dash ? project.creator.handle : `Added a new Project - ${project.title}`}
      link={link}
      project={project}
      urlPush={()=>{props.router.push(link)}}/>
    )}
  ))
  // console.log('list', list);
  list = list.filter(item=>!!(item && item.props && item.props.date)).sort( (a,b) => {
    // console.log('BAD DTE', !a.props.date && a.props);
    return b.props.date - a.props.date
  })
  // console.log('list', list);
  return dash ? list.slice(0,10) : list
}

export const ActivityList = (props) => (
  <ScrollBox borderTop={props.dash}> {makeList(props)} </ScrollBox>
)
