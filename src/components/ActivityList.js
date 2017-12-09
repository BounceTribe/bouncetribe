import React from 'react'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {Activity, ScrollBox, NameLink} from 'styled/ActivityList'
import {BtAvatar} from 'styled'
import {purple} from 'theme'

const getLink = (project) => (
  project.privacy==='PUBLIC' &&
  !project.creator.deactivated &&
  `/${project.creator.handle}/${project.title}`
)
const getAvatar = (router,user) => (
  <BtAvatar hideOnline pointer size={40}
    onClick={()=>router.push(user.handle)}
    user={user} />
)

const makeList = (props) => {
  // console.log('listprops', props);
  let {comments, bounces, projects, dash, router} = props
  let text, icon
  let commentProjects = []
  let list = comments.map((comment, index) => {
    // let project = comment.project || {}
    let {author, project, createdAt, id} = comment
    if (dash) {
      text = (
        <span>
          <NameLink to={`/${author.handle}`}>{author.handle} </NameLink>
          gave feedback to
          <NameLink to={`/${project.creator.handle}/${project.title}`}> {project.title} </NameLink>
        </span>)
      icon = getAvatar(router, author)
    } else {
      text = `Gave feedback to ${project.title}`
      icon = <Tribe height={13}/>
      if (commentProjects.includes(project.id)) {
        // console.log('duplicate project ignored')
        return <div key={index}/>
      }
      commentProjects.push(project.id)
    }

    return project.id &&
    <Activity dash={dash}
      key={id}
      date={new Date(createdAt)}
      icon={icon}
      text={text}
      link={getLink(project)}/>
  })
  list = list.concat(bounces.map(bounce => {
    let {bouncer, project, id, createdAt} = bounce

    if (dash) {
      text = (
        <span>
          <NameLink to={`/${bouncer.handle}`}>{bouncer.handle} </NameLink>
          bounced
          <NameLink to={`/${project.creator.handle}/${project.title}`}> {project.title}</NameLink>
        </span>)
      icon = getAvatar(router, bouncer)
    } else {
      text = `Bounced ${project.title}`
      icon = <Tribe height={13}/>
    }
    return (
    <Activity dash={dash} key={id} icon={icon} text={text}
      date={new Date(createdAt)}
      link={getLink(project)}/>
    )}
  ))

  list = list.concat(projects.map(project => {
    let {createdAt, creator, title, id} = project
    let link = getLink(project)
    if (dash) {
      text = (<NameLink to={`/${creator.handle}`}>{creator.handle}</NameLink>)
      icon = getAvatar(router, creator)
    } else {
      text = `Bounced ${title}`
      icon = <Tribe height={13}/>
    }
    return (
    <Activity Activity dash={dash} key={id} icon={icon} text={text}
      date={new Date(createdAt)}
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
  return dash ? list : list
}

export const ActivityList = (props) => (
  <ScrollBox borderTop={props.dash}> {makeList(props)} </ScrollBox>
)
