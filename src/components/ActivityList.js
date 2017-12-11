import React from 'react'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {Activity, ScrollBox, NameLink} from 'styled/ActivityList'
import {BtAvatar} from 'styled'
import {purple} from 'theme'

const getLink = (project) => (
  (project.privacy==='PUBLIC' &&
  !project.creator.deactivated &&
  `/${project.creator.handle}/${project.title}`) || null
)
const getAvatar = (router,user) => (
  <BtAvatar hideStatus pointer size={40}
    onClick={()=>router.push(user.handle)}
      user={user} />
)

const makeList = (props) => {
  let {comments, bounces, projects, dash, router} = props
  let text, icon
  let commentProjects = []

  let list = comments.map((comment, index) => {
    let {author, project, createdAt, id} = comment
    if (commentProjects.includes(author.id+project.id)) {
      return <div key={index}/>
    }
    commentProjects.push(author.id+project.id)
    let link = getLink(project)
    if (dash) {
      text = (
        <span>
          <NameLink to={`/${author.handle}`}>{author.handle} </NameLink>
          gave feedback to
          <NameLink to={link}> {project.title} </NameLink>
        </span>)
      icon = getAvatar(router, author)
    } else {
      icon = <Bounce width={19} fill={purple}/>
      text = `Gave feedback to ${project.title}`
    }

    return (
      <Activity dash={dash} key={id} icon={icon} text={text}
        link={link}
        date={new Date(createdAt)}
      />
      )
  })
  list = list.concat(bounces.map(bounce => {
    let {bouncer, project, id, createdAt} = bounce
    let link = getLink(project)
    if (dash) {
      text = (
        <span>
          <NameLink to={`/${bouncer.handle}`}>{bouncer.handle} </NameLink>
          bounced
          <NameLink to={link}> {project.title}</NameLink>
        </span>)
      icon = getAvatar(router, bouncer)
    } else {
      text = `Bounced ${project.title}`
      icon = <Tribe height={13}/>
    }
    return (
    <Activity dash={dash} key={id} icon={icon} text={text}
      date={new Date(createdAt)}
      link={link}/>
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
      icon = <Music height={13}/>
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
  return dash ? list.slice(0,10) : list
}

export const ActivityList = (props) => (
  <ScrollBox borderTop={props.dash}> {makeList(props)} </ScrollBox>
)
