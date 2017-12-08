import React from 'react'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import styled from 'styled-components'
import {BtLink, BtAvatar} from 'styled'
import {grey300, grey500, purple} from 'theme'

export const ScrollBox = styled.div`
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  border-top: ${({borderTop}) => (borderTop) && `1px solid ${grey300}`};
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
`
  const ActivityContainer = styled(BtLink)`
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${grey300};
    padding: 10px 20px;
    &:hover > div {
      color: ${purple}
    }
  `
    const ActivityDate = styled.div`
      font-size: 12px;
      color: ${grey500};
      width: 70px;
    `
    const ActivityIcon = styled.div`
      padding: 0 10px;
    `
    const ActivityText = styled.div`
      font-size: 15px;
      font-weight: 400;
      color: #4A4A4A;
    `

export const Activity = ({date, icon, text, link, dash}) => {
  let formattedDate = date
    .toLocaleDateString('en-US', {month: 'short', 'day': 'numeric'})
  return (
    <div >
    <ActivityContainer to={link ? link : null}>
      <ActivityDate>{formattedDate}</ActivityDate>
      <ActivityIcon>{icon}</ActivityIcon>
      <ActivityText>{text}</ActivityText>
    </ActivityContainer>
  </div>
  )
}

const generateLink = (project) => (
  project.privacy==='PUBLIC' &&
  !project.creator.deactivated &&
  `/${project.creator.handle}/${project.title}`
 )

 // const makeFeed = (props) => {
 //   let {comments, bounces, projects} = {...props}
 //   console.log('...props', comments, bounces, projects);
 //   let byUser = {}
 //
 //
 // }

const makeList = (props) => {
  // console.log('listprops', props);
  let {comments, bounces, projects, dash} = props
  // if (dash) {
  //   let bounceAvatar = bounces.count && <BtAvatar user={bounces[0].bouncer} />
  //   let commentAvatar = comments.count && <BtAvatar user={comments[0].author.bouncer} />
  //   let bounceAvatar = bounces.count && <BtAvatar user={bounces[0].bouncer} />
  //
  // }

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
    // if (dash && !avatarList.) {
    //
    // }
    // let avatar = dash
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
    return (
    <Activity dash={dash}
      key={project.id}
      date={new Date(project.createdAt)}
      icon={dash ? <BtAvatar hideOnline size={40} user={project.creator} /> : <Music height={13}/>}
      text={`${dash ? project.creator.handle + ' a' : 'A'}dded a new Project - ${project.title}`}
      link={generateLink(project)}/>
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
