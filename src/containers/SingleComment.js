import React, {Component} from 'react'
import Relay from 'react-relay'
import {white, purple, blue, grey700} from 'theme'
import {Single, MainRow, Bottom, Content, Time, Text, Top, ButtonCol, Handle, BotLink, UpVote, SCContainer, SubComment, SCHandle, SCBottom, SCCol, SCText} from 'styled/Comments'
import {RoundButton, BtAvatar} from 'styled'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import formatTime from 'utils/formatTime'
import TextField from 'material-ui/TextField'
import UpdateComment from 'mutations/UpdateComment'
import CreateComment from 'mutations/CreateComment'
import DeleteComment from 'mutations/DeleteComment'
import AddToCommentUpvotes from 'mutations/AddToCommentUpvotes'


class SingleComment extends Component {

  constructor(props) {
    super()
    this.listenTab = props.tabs==='listen'
    this.comment = props.comment
    this.user = props.user
    this.isFirst = (props.index === 0)
    this.isOwnComment = (props.user.id === props.comment.author.id)
    let commentUpvotes = ((props.comment.upvotes || {}).edges || []).map(edge=>edge.node.id)
    // let userUpvotes = ((props.user.upvotes || {}).edges || []).map(edge=>edge.node.id)
    // console.log(commentUpvotes, userUpvotes)
    this.state = {
      text: props.comment.text,
      newUpvote: 0,
      hasUpvoted: commentUpvotes.some(id=>(id===props.user.id)),
      newSubcomment: "",
      deleted: [],
      children: ((props.comment.children || {}).edges || []).map(edge => edge.node),
    }

  }

  componentDidMount() {
    if(this.props.focus === this.comment.id){
      document.getElementById(this.comment.id).scrollIntoView({behavior:'instant', block: 'nearest'})
    }
  }

  editComment = () => {
    if (this.isFirst) {
      let commentData = {
        authorId: this.comment.author.id,
        projectId: this.comment.project.id,
        type: this.comment.type,
        timestamp: this.comment.timestamp,
        text: this.state.text,
        sessionId: this.props.sessionId
      }
      Relay.Store.commitUpdate(new CreateComment(commentData), {
        onSuccess: success => {
          commentData.author = this.user
          commentData.id = success.createComment.comment.id
          commentData.key = success.createComment.comment.id
          this.props.commentCreated(commentData)
          this.setState({text: ""})
        }
      }
    )
    } else {
      Relay.Store.commitUpdate(
        new UpdateComment({id: this.comment.id, text: this.state.text})
      )
      this.props.deactivate(this.props.index)
    }
  }

  text = () => {
    if (this.props.active || this.isFirst) {
      return (
        <TextField
          id={this.comment.id}
          value={this.state.text}
          onChange={(e,newVal)=>this.setState({text:newVal})}
          fullWidth
          multiLine
          autoFocus={(this.props.focus === this.comment.id || this.isFirst)}
          onKeyPress={(e)=>{
            if (e.charCode === 13 && !e.shiftKey) {
              e.preventDefault()
              this.editComment()
            }
          }}
          textareaStyle={{
            color: grey700,
            fontSize:'16px',
            wordBreak:'break-all',
            lineHeight: '18px'
          }}
          underlineFocusStyle={{
            borderColor: (this.comment.type === 'COMMENT' ) ? blue : purple
          }}
        />
      )
    } else {
      return (this.state.text)
    }
  }

  addUpvote = () => {
    Relay.Store.commitUpdate(
      new AddToCommentUpvotes({
        upvotesUserId: this.user.id,
        upvotesCommentId: this.comment.id
      }), { onSuccess: (res) => {
        console.log('upvote res', res);
        this.setState({
          newUpvote: this.state.newUpvote + 1,
          hasUpvoted: true
        })
      } }
    )
  }

  deleteComment = (id) => Relay.Store.commitUpdate(
    new DeleteComment({
      id,
      projectId: this.comment.projectId || this.comment.project.id
    }), {
      onSuccess: (res)=>this.setState({deleted: this.state.deleted.concat([id])})
    }
  )

  hider = () => {
    if (this.props.index===0) return false
    else if (!this.isOwnComment && this.props.tabs==='listen') return true
    else return false
  }

  subcomments = () => {
    return (
      <SCContainer>
        {this.state.children.map(child=>{
          let {id, author, text} = child
          return (
            <SubComment key={id} hide={this.state.deleted.includes(id)}>
              <BtAvatar user={author} size={30} style={{paddingTop: '5px'}} />
              <SCCol>
                <SCHandle to={author.deactivated ? null : `/${author.handle}`}>
                  {author.handle}
                </SCHandle>
                <SCText>{text}</SCText>
                {this.user.id===author.id && <SCBottom>
                  <BotLink
                    onClick={()=>{this.props.active ?
                      this.editComment() : this.props.activate(id)}}
                  >Edit</BotLink>
                  {'|'}
                  <BotLink onClick={()=>this.deleteComment(id)}>
                    Delete
                  </BotLink>
                </SCBottom>}
            </SCCol>
            </SubComment>
          )
        })}
        <SubComment key={'input'} >
          <BtAvatar user={this.user} size={30} />
          <SCCol><SCHandle>{this.user.handle}</SCHandle></SCCol>
          <TextField
            ref='scTextField'
            value={this.state.newSubcomment}
            name={'newSubcomment'}
            hintText={'Add a comment'}
            hintStyle={{fontSize: '14px'}}
            onChange={(e,newVal)=>this.setState({newSubcomment:newVal})}
            multiLine
            fullWidth
            textareaStyle={{
              color: grey700,
              fontSize:'14px',
              wordBreak:'break-all',
              lineHeight: '16px'
            }}
            onKeyPress={(e)=>{
              if (e.charCode === 13 && !e.shiftKey) {
                e.preventDefault()
                let newSubcommentData = {
                  authorId: this.user.id,
                  author: this.user, //for real time
                  type: 'COMMENT',
                  text: this.state.newSubcomment,
                  parentId: this.comment.id
                }
                Relay.Store.commitUpdate(
                  new CreateComment(newSubcommentData), {
                    onSuccess: success => {
                      this.refs.scTextField.blur();
                      newSubcommentData.id = success.createComment.comment.id
                      this.setState({
                        children: this.state.children.concat(newSubcommentData),
                        newSubcomment: ''
                      })
                    },
                    onFailure: failure => console.log('fail subcomment', failure)
                  }
                )
              }
            }}
          />
        </SubComment>
      </SCContainer>)
  }

  render() {
    let {author, timestamp, type, id, upvotes} = this.comment
    let {newUpvote} = this.state
    let totalUpvotes = (upvotes||newUpvote) && (upvotes.edges.length + newUpvote)
    let hideEditDelete = this.isFirst ||  !this.isOwnComment
    return (
      <Single id={id} hide={this.hider() || this.state.deleted.includes(id)} >
        <MainRow>
          <Top>
            <ButtonCol>
              <RoundButton
                onClick={()=>{
                  console.log('button click', this.props, timestamp)
                  this.props.jumpToTime(timestamp)
                }}
                icon={(type === 'COMMENT') ?
                  <Comment height={25} width={25} fill={white} />
                  : <Heart height={25} width={25} fill={white} />
                }
                mini
                secondary={(type === 'COMMENT')}
              />
            </ButtonCol>
            <Content>
              <Handle to={author.deactivated ? null : `/${author.handle}`} >
                {author.handle}
              </Handle>
              <Text>{this.text()}</Text>
            </Content>
            <Time onClick={()=>{
              console.log('time click', this.props, timestamp)
              this.props.jumpToTime(timestamp)
            }}>{formatTime(timestamp)}</Time>
          </Top>
          <Bottom>
            {!hideEditDelete && <BotLink
              onClick={()=>{this.props.active ?
                this.editComment() : this.props.activate(this.props.index)}}
            >Edit</BotLink>}
            {!hideEditDelete && '|'}
            {!hideEditDelete &&
              <BotLink onClick={()=>this.deleteComment(id)}>Delete</BotLink>}
            <UpVote
              secondary={(type==='COMMENT')}
              hideLink={this.listenTab}
              hasUpvoted={this.state.hasUpvoted}
              onClick={!this.isOwnComment && !this.state.hasUpvoted && this.addUpvote}
            >Upvote{this.state.hasUpvoted && 'd'} | {totalUpvotes}</UpVote>
            <BotLink
              onClick={()=>{
                this.setState({subcomments: !this.state.subcomments})
              }}
            >
              {this.state.children.length ?
                `View Comments | ${this.state.children.length}`
                : 'Add Comment'}
            </BotLink>
          </Bottom>
        </MainRow>
        {this.state.subcomments && this.subcomments()}
      </Single>
    )
  }
}

// editAndDelete = () => {
//   return (
//     <div>
//       <BotLink
//         onClick={()=>{this.props.active ?
//           this.editComment() : this.props.activate(this.props.index)}}
//       >Edit</BotLink>
//       {this.listenTab && '|'}
//       <BotLink
//         onClick={this.deleteComment}
//       >Delete</BotLink>
//     </div>
//   )
// }

export default SingleComment
