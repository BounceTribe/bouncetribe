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
    let commentList = this.createCommentList(props)
    let bounceList = this.createBounceList(props)
    let projectList = this.createProjectList(props)
    this.state = {
      commentList,
      bounceList,
      projectList,
      fullList: this.dateSort(commentList.concat(bounceList, projectList)),
      lastNew:10
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.numActivities > this.props.numActivities) {
      let newComments = this.createCommentList(nextProps)
      let newBounces = this.createBounceList(nextProps)
      let newProjects = this.createProjectList(nextProps)
      let newSort = this.dateSort(newComments.concat(newBounces, newProjects))

      //next page if less than 3 new items
      if ((newSort.length<3) && nextProps.hasMore && !nextProps.loading) {
        nextProps.getMore()
      } else {
        this.setState({
          commentList: this.state.commentList.concat(newComments),
          bounceList: this.state.bounceList.concat(newBounces),
          projectList: this.state.projectList.concat(newProjects),
          fullList: this.state.fullList.concat(newSort),
        })
        console.log('post updated', this.state);
      }
    }
  }

  dateSort = elmsWithDateProps =>
    elmsWithDateProps.sort( (a,b) =>  b.props.date - a.props.date)

  createCommentList = (props) => {
    let oldList = (this.state || {}).commentList || []
    let oldLen = oldList.length
    let {comments, dash, router} = props
    let text, icon
    //prevents two identical items from occuring consecutively
    let lastOne = oldLen && oldList[oldLen-1].dupeKey
    let dupeFiltered = comments.filter(comment => {
      let {author, project} = comment
      if (lastOne===author.id+project.id) {
        return false
      } else {
        lastOne = author.id+project.id
        return true
      }
    })
    let newLen = dupeFiltered.length


    let commentList = dupeFiltered.slice(oldLen, newLen).map(comment => {
      let {author, project, createdAt, id} = comment
      let dupeKey = author.id + project.id
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
        <Activity dash={dash} key={id} icon={icon} text={text} dupeKey={dupeKey}
          link={link}
          date={new Date(createdAt)} />)
    })
    return commentList
  }

  createBounceList = (props) => {
    let { bounces, dash, router} = props
    let text, icon
    let oldList = (this.state || {}).bounceList || []
    let oldLen = oldList.length
    let newLen = bounces.length

    let bounceList = bounces.slice(oldLen, newLen).map(bounce => {
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
    )
    return bounceList
  }

  createProjectList = (props) => {
    let { projects, dash, router} = props
    let text, icon
    let oldList = (this.state || {}).projectList || []
    let oldLen = oldList.length
    let newLen = projects.length
    let projectList = projects.slice(oldLen, newLen).map(project => {
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
      )
    })
    return projectList
  }

  render() {
    return (
      <ScrollBox borderTop={this.props.dash} >
        {this.state.fullList}
        {this.props.nextPage}
      </ScrollBox>
    )
  }
}

//
// createList = (props, oldLength) => {
//   console.log('state', this.state);
//   let {commentList, bounceList, projectList} = this.state
//   let list = commentList.concat(bounceList, projectList)
//   // console.log('list', list);
//   // list = list.filter(item=>!!(item && item.props && item.props.date))
//   //     .sort( (a,b) => {
//   //       return b.props.date - a.props.date
//   //   })
//
//   // if (((oldLength + 3) > list.length) && !props.loading && props.hasMore) {
//   //   console.log('requesting more');
//   //   props.getMore()
//   // } else {
//   //   this.setState({oldLength: list.length})
//   // }
//   console.log('list', list);
//   console.log('props', this.props);
//   return list
// }
