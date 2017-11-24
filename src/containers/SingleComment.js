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
    this.listenTab = props.tabs==='listen'

    this.state = {
      text: props.comment.text,
      newSubcomment: "",
      deleted: [],
      children: ((props.comment.children || {}).edges || []).map(edge => edge.node),

    }
    console.log('singleprops', props)
    this.isFirst = (props.index === 0)
    this.isOwnComment = (props.user.id === props.comment.author.id)
  }

  componentDidMount(){
    if(this.props.focus === this.props.comment.id){
      document.getElementById(this.props.comment.id).scrollIntoView({behavior:'instant', block: 'nearest'})
    }
  }

  editComment = () => {
    if (this.isFirst) {
      let commentData = {
        authorId: this.props.comment.author.id,
        projectId: this.props.comment.project.id,
        type: this.props.comment.type,
        timestamp: this.props.comment.timestamp,
        text: this.state.text,
        sessionId: this.props.sessionId
      }
      Relay.Store.commitUpdate(
        new CreateComment(commentData)
      ) // TODO: success
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
          onChange={(e,newVal)=>{this.setState({text:newVal})}}
          fullWidth
          multiLine
          autoFocus={(this.props.focus === this.props.comment.id || this.isFirst)}
          onKeyPress={(e)=>e.charCode===13 && this.editComment(e)}
          textareaStyle={{
            color: grey700,
            fontSize:'16px',
            wordBreak:'break-all',
            lineHeight: '18px'
          }}
          underlineFocusStyle={{
            borderColor: (this.props.comment.type === 'COMMENT' ) ? blue : purple
          }}
        />
      )
    } else {
      return (this.state.text)
    }
  }

  addUpvote = () => Relay.Store.commitUpdate(
    new AddToCommentUpvotes({
      upvotesUserId: this.props.user.id,
      upvotesCommentId: this.props.comment.id
    })
  )

  deleteComment = (id) => Relay.Store.commitUpdate(
    new DeleteComment({
      id,
      projectId: this.props.comment.project.id
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
          console.log('usre child', child);
          return (
            <SubComment key={child.id} hide={this.state.deleted.includes(child.id)}>
              <BtAvatar user={child.author} size={30} />
              <SCCol>
                <SCHandle>{child.author.handle}</SCHandle>
                {this.props.user.id===child.author.id && <Bottom>
                  <BotLink
                    onClick={()=>{this.props.active ?
                      this.editComment() : this.props.activate(this.props.index)}}
                  >Edit</BotLink>
                  {'|'}
                  <BotLink
                    onClick={()=>this.deleteComment(child.id)}
                  >Delete</BotLink>
                </Bottom>}
              </SCCol>
              <SCText>{child.text}</SCText>
            </SubComment>
          )
        })}
        <SubComment key={'input'} >
          <BtAvatar user={this.props.user} size={30} />
          <SCCol><SCHandle>{this.props.user.handle}</SCHandle></SCCol>
          <TextField
            ref='scTextField'
            value={this.state.newSubcomment}
            name={'newSubcomment'}
            hintText={'Add a comment'}
            hintStyle={{fontSize: '14px'}}
            onChange={(e,newVal)=>this.setState({newSubcomment:newVal})}
            multiLine
            fullWidth
            // underlineStyle={{margin: '0', padding: '0'}}
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
                      this.refs.scTextField.blur();
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
    console.log('sc render', this.state);
    let {author, timestamp, type, id, upvotes} = this.props.comment
    let hideEditDelete = this.isFirst ||  !this.isOwnComment
    return (
      <Single id={id} hide={this.hider() || this.state.deleted.includes(id)} >
        <MainRow>
          <InfoOptions>
            <InfoRow>
              <RoundButton
                icon={(type === 'COMMENT') ?
                  <Comment height={25} width={25} fill={white} />
                  :<Heart height={25} width={25} fill={white} />
                }
                mini
                secondary={(type === 'COMMENT')}
              />
              <Handle to={author.deactivated ? null : `/${author.handle}`} >
                {author.handle}
              </Handle>
            </InfoRow>
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
                onClick={!this.isOwnComment && this.addUpvote}
              >Upvote | {upvotes ? upvotes.edges.length : 0}</UpVote>
              <BotLink
                hideLink={this.listenTab}
                onClick={()=>{
                  this.setState({subcomments: !this.state.subcomments})
                }}
              >
                {this.state.children.length ?
                  `View Comments | ${this.state.children.length}`
                  : 'Add Comment'}
              </BotLink>
            </Bottom>
          </InfoOptions>
          <Text>{this.text()}</Text>
          <Time>{formatTime(timestamp)}</Time>
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
