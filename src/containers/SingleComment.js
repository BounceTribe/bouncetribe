import React, {Component} from 'react'
import {Single, MainRow, Bottom, Time, Text, InfoOptions, Handle, BotLink, UpVote, SCContainer, SubComment, SCHandle, InfoRow, SCCol, SCText} from 'styled/Comments'
import {RoundButton, BtAvatar} from 'styled'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import formatTime from 'utils/formatTime'
import TextField from 'material-ui/TextField'
import UpdateComment from 'mutations/UpdateComment'
import Relay from 'react-relay'
import {white, purple, blue, grey700} from 'theme'
import CreateComment from 'mutations/CreateComment'
import DeleteComment from 'mutations/DeleteComment'
import AddToCommentUpvotes from 'mutations/AddToCommentUpvotes'


class SingleComment extends Component {

  constructor(props) {
    super()
    this.state = {
      text: props.comment.text,
      newSubcomment: "",
      deleted: false,
      children: ((props.comment.children || {}).edges || []).map(edge => edge.node)
    }
    console.log('singleprops', props)
    this.isFirst = (props.index === 0)
    this.isOwnComment = (props.user.id === props.comment.author.id)
  }


  editComment = () => {
    if (this.isFirst) {
      Relay.Store.commitUpdate(
        new CreateComment({
          authorId: this.props.comment.author.id,
          projectId: this.props.comment.project.id,
          type: this.props.comment.type,
          timestamp: this.props.comment.timestamp,
          text: this.state.text,
          sessionId: this.props.sessionId
        })
      )
      this.props.commentCreated()
      this.setState({text: ""})
    } else {
      Relay.Store.commitUpdate(
        new UpdateComment({id: this.props.comment.id, text: this.state.text})
      )
      this.props.deactivate(this.props.index)
    }
  }

  text = () => {
    if (this.props.active || this.isFirst) {
      return (
        <TextField
          id={this.props.comment.id}
          value={this.state.text}
          onChange={(e,newValue)=>{this.setState({text:newValue})}}
          fullWidth
          multiLine
          autoFocus={(this.props.focus === this.props.comment.id || this.isFirst)}
          onKeyPress={(e)=>e.charCode===13 && this.editComment(e)}
          // style={{ marginTop: '-16px', }}
          textareaStyle={{ color: grey700, fontSize:'16px', wordBreak:'break-all', lineHeight: '18px' }}
          style={{display:'flex', flexDirection:'column',
margin:'0 20px'}}
          underlineFocusStyle={{
            borderColor: (this.props.comment.type === 'COMMENT' ) ? blue : purple
          }}
        />
      )
    } else {
      return (<Text>{this.state.text}</Text>)
    }
  }

  componentDidMount(){
    if(this.props.focus === this.props.comment.id){
      document.getElementById(this.props.comment.id).scrollIntoView({behavior:'instant', block: 'nearest'})
    }
  }

  addUpvote = () => Relay.Store.commitUpdate(
    new AddToCommentUpvotes({
      upvotesUserId: this.props.user.id,
      upvotesCommentId: this.props.comment.id
    })
  )

  deleteComment = () => Relay.Store.commitUpdate(
    new DeleteComment({
      id: this.props.comment.id,
      projectId: this.props.comment.project.id
    }), {
      onSuccess: (res)=>this.setState({deleted: true})
    }
  )

  hider = () => {
    if (this.props.index===0) return false
    else if (!this.isOwnComment && this.props.tabs==='listen') return true
    else return false
  }

  subComments = () => {

    return (
    <MainRow>
      <SCContainer>
        {this.state.children.map(child=>{
          return (
            <SubComment key={child.id} >
              <BtAvatar user={child.author} size={30} />
              <SCCol>
                <SCHandle>{child.author.handle}</SCHandle>
                <SCText>{child.text}</SCText>
              </SCCol>
            </SubComment>
          )
        })}
        <TextField
          value={this.state.newSubcomment}
          name={'newSubcomment'}
          hintText={'Add a comment'}
          onChange={(e,newValue)=>{this.setState({newSubcomment:newValue})}}
          style={{ marginLeft: '35px' }}
          onKeyPress={(e)=>{
            if (e.charCode === 13) {
              let newSubcommentData = {
                authorId: this.props.user.id,
                author: this.props.user, //for real time
                type: 'COMMENT',
                text: this.state.newSubcomment,
                parentId: this.props.comment.id
              }
              Relay.Store.commitUpdate(
                new CreateComment(newSubcommentData), {
                  onSuccess: success => {
                    console.log('newSubcomment', this.state.children)
                    this.setState({
                      children: this.state.children.concat(newSubcommentData)
                    })
                  },
                  failure: failure => console.log('fail subcomment', failure)
                }
              )
              this.setState({newSubcomment: ""})
            }
          }}
        />
      </SCContainer>
    </MainRow>)
  }

  render() {
    let {author, timestamp, type, id, upvotes} = this.props.comment
    let hideEditDelete = this.props.tabs==='view' || this.isFirst || !this.isOwnComment
    let listenTab = this.props.tabs==='listen'
    return (
      <Single id={id} hide={this.hider() || this.state.deleted} >
        <MainRow>
          <InfoOptions>
            <InfoRow>
              <RoundButton
                icon={(type === 'COMMENT') ?
                  <Comment height={25} width={25} fill={white} />
                  :
                  <Heart height={25} width={25} fill={white} />
                }
                mini
                // style={{display: 'flex'}}
                secondary={(type === 'COMMENT')}
              />
              <Handle to={author.deactivated ? null : `/${author.handle}`} >
                {author.handle}
              </Handle>
            </InfoRow>
            <Bottom>
              <BotLink
                onClick={()=>{this.props.active ?
                  this.editComment() : this.props.activate(this.props.index)}}
                hideLink={hideEditDelete}
              >
                Edit
              </BotLink>{listenTab && '|'}
              <BotLink
                hideLink={hideEditDelete}
                onClick={this.deleteComment}
              >
                Delete
              </BotLink>
              <UpVote
                secondary={(type==='COMMENT')}
                hideLink={(listenTab)}
                onClick={this.addUpvote}
              >
                Upvote | {upvotes ? upvotes.edges.length : 0}
              </UpVote>
              <BotLink
                hideLink={(listenTab)}
                onClick={()=>{
                  this.setState({subcomments: !this.state.subcomments})
                }}
              >
                Comments | {this.state.children.length}
              </BotLink>
            </Bottom>
          </InfoOptions>
          {this.text()}
          <Time>{formatTime(timestamp)}</Time>
        </MainRow>
        {this.state.subcomments && this.subcomments}
      </Single>
    )
  }
}


export default SingleComment
