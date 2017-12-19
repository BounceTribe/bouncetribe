import React, {Component} from 'react'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'
import {Activity, ScrollBox, NameLink} from 'styled/ActivityList'
import {BtAvatar} from 'styled'
import {purple} from 'theme'


const getLink = (project, friendIds) => {
  //TODO fix this mess with userhandle params in filters
  //friendIds includes self id
  let isTribe = friendIds.includes(project.creator.id)
  let tribeOk = isTribe && (project.privacy==='TRIBE')

  if (tribeOk || project.privacy==='PUBLIC')
    return `/${project.creator.handle}/${project.title}/`
  else
    return null
}
const getAvatar = (router,user) => (
  <BtAvatar user={user} hideStatus pointer size={40}
    onClick={()=>router.push(`/${user.handle}/`)} />
)

export class ActivityList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      commentProjects: [],
      list: this.createList(props)
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      list: this.state.list.concat(this.createList(nextProps))
    })
  }

  createList = (props) => {
    let {newComments, newBounces, newProjects, dash, router} = props
    let text, icon
    let commentProjects = this.state.commentProjects

    let list = newComments.map((comment, index) => {
      let {author, project, createdAt, id} = comment
      if (commentProjects.includes(author.id+project.id)) {
        return <div key={index}/>
      } else {
        commentProjects.push(author.id+project.id)
      }
      let link = getLink(project, props.friendIds)
      if (dash) {
        text = (
          <span>
            <NameLink to={`/${author.handle}/`}>{author.handle} </NameLink>
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
    list = list.concat(newBounces.map(bounce => {
      let {bouncer, project, id, createdAt} = bounce
      let link = getLink(project, props.friendIds)
      if (dash) {
        text = (
          <span>
            <NameLink to={`/${bouncer.handle}/`}>{bouncer.handle} </NameLink>
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

    list = list.concat(newProjects.map(project => {
      let {createdAt, creator, title, id} = project
      let link = getLink(project, props.friendIds)
      if (dash) {
        text = (<NameLink to={`/${creator.handle}/`}>{creator.handle}</NameLink>)
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
      return b.props.date - a.props.date
    })
    // props.canGetMore && props.getMore()
    console.log('list', list);
    console.log('props', this.props);
    return list
  }

  render() {
    return (
      <ScrollBox borderTop={this.props.dash} >
        {this.makeList(this.props)}
        {this.props.nextPage}
      </ScrollBox>
    )
  }
}
