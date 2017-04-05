import React, {Component} from 'react'
import {Single, Bottom, Time, Text, Center, Handle, BotLink, UpVote, SCContainer, SubComment, SCHandle, CommentP, SCPortrait, SCCol, SCText} from 'styled/Comments'
import {RoundButton} from 'styled'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'

import formatTime from 'utils/formatTime'
import TextField from 'material-ui/TextField'
import UpdateComment from 'mutations/UpdateComment'
import Relay from 'react-relay'
import {white} from 'theme'
import CreateComment from 'mutations/CreateComment'
import DeleteComment from 'mutations/DeleteComment'
import AddToCommentUpvotes from 'mutations/AddToCommentUpvotes'


class SingleComment extends Component {

  state = {
    text: "",
    newSubcomment: ""
  }

  componentWillMount(){
    this.setState({text: this.props.comment.text})

  }

  editComment = (e) => {
    if (e.charCode === 13) {
      if (this.props.index === 0) {
        Relay.Store.commitUpdate(
          new CreateComment({
            authorId: this.props.comment.author.id,
            projectId: this.props.comment.project.id,
            type: this.props.comment.type,
            timestamp: this.props.comment.timestamp,
            text: this.state.text
          })
        )
        this.props.commentCreated()
      } else {
        Relay.Store.commitUpdate(
          new UpdateComment({
            id: this.props.comment.id,
            text: this.state.text,
          })
        )
        this.props.deactivate(this.props.index)
      }

    }
  }

  text = () => {
    if (this.props.active || this.props.index === 0) {
      return (
        <TextField
          id={this.props.comment.id}
          value={this.state.text}
          onChange={(e,newValue)=>{this.setState({text:newValue})}}
          fullWidth={true}
          autoFocus={(this.props.focus === this.props.comment.id || this.props.index === 0)}
          onKeyPress={this.editComment}
        />
      )
    } else {
      return (
        <CommentP>{this.props.comment.text}</CommentP>
      )
    }
  }

  componentDidMount(){
    if(this.props.focus === this.props.comment.id){
      console.log("match" )
      document.getElementById(this.props.comment.id).scrollIntoView({behavior:'smooth',block: 'start'})
    }
  }

  render() {
    let {author, timestamp, type, id, upvotes} = this.props.comment
    return (
      <Single
        id={id}
      >
        <RoundButton
          icon={(type === 'COMMENT') ?
            <Comment
              height={25}
              width={25}
              fill={white}
            />
            :
            <Heart
              height={25}
              width={25}
              fill={white}
            />
          }
          mini
          secondary={(type === 'COMMENT')}
          style={{
            marginTop: '30px'
          }}
        />
        <Center>
          <Text>
            <Handle
              comment={(type === 'COMMENT')}
            >
              {author.handle}
            </Handle>
            {this.text()}
          </Text>
          <Bottom>
            <BotLink
              onClick={()=>{this.props.activate(this.props.index)}}
              hideLink={(this.props.tabs === 'view' || this.props.index === 0)}
            >
              Edit
            </BotLink>
            <BotLink
              hideLink={(this.props.tabs === 'view' || this.props.index === 0)}
              onClick={()=>{
                console.log("this.props.comment.project.id", this.props.comment.project.id )
                Relay.Store.commitUpdate(
                  new DeleteComment({
                    id: this.props.comment.id,
                    projectId: this.props.comment.project.id
                  })
                )
              }}
            >
              Delete
            </BotLink>
            <UpVote
              secondary={(type==='COMMENT')}
              hideLink={(this.props.tabs === 'listen')}
              onClick={()=>{
                Relay.Store.commitUpdate(
                  new AddToCommentUpvotes({
                    upvotesUserId: this.props.userId,
                    upvotesCommentId: this.props.comment.id
                  })
                )
              }}
            >
              Upvote | {(upvotes.edges) ? upvotes.edges.length : ''}
            </UpVote>
            <BotLink
              hideLink={(this.props.tabs === 'listen')}
              onClick={()=>{
                this.setState((prevState)=>{return {subcomments: !prevState.subcomments}})
              }}
            >
              Comments | {this.props.comment.children.edges.length}
            </BotLink>
          </Bottom>
          {(this.state.subcomments) ?
            <SCContainer>
            {this.props.comment.children.edges.map(edge=>{
              return (
                <SubComment
                  key={edge.node.id}
                >
                  <SCPortrait
                    src={edge.node.author.portrait.url}
                  />
                  <SCCol>
                    <SCHandle>
                      {edge.node.author.handle}
                    </SCHandle>
                    <SCText>
                      {edge.node.text}
                    </SCText>
                  </SCCol>

                </SubComment>
              )
            })}
            <TextField
              value={this.state.newSubcomment}
              name={'newSubcomment'}
              hintText={'Add a comment'}
              onChange={(e,newValue)=>{this.setState({newSubcomment:newValue})}}
              style={{
                marginLeft: '35px'
              }}
              onKeyPress={(e)=>{
                if (e.charCode === 13) {
                  Relay.Store.commitUpdate(
                    new CreateComment({
                      authorId: this.props.userId,
                      type: 'COMMENT',
                      text: this.state.newSubcomment,
                      parentId: this.props.comment.id
                    })
                  )
                }
              }}
            />
            </SCContainer> : null
          }
        </Center>
        <Time>
          {formatTime(timestamp)}
        </Time>
      </Single>
    )
  }
}


export default SingleComment
