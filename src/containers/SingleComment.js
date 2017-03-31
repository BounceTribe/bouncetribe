import React, {Component} from 'react'
import {Single, Bottom, Time, Text, Center, Handle, BotLink, UpVote} from 'styled/Comments'
import {RoundButton} from 'styled'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'

import formatTime from 'utils/formatTime'
import TextField from 'material-ui/TextField'
import UpdateComment from 'mutations/UpdateComment'
import Relay from 'react-relay'
import {white} from 'theme'

class SingleComment extends Component {

  state = {
    text: ""
  }

  componentWillMount(){
    this.setState({text: this.props.comment.text})

  }

  editComment = (e) => {
    if (e.charCode === 13) {
      Relay.Store.commitUpdate(
        new UpdateComment({
          id: this.props.comment.id,
          text: this.state.text,
        })
      )
      this.props.deactivate(this.props.index)
    }
  }

  text = () => {
    if (this.props.active) {
      return (
        <TextField
          id={this.props.comment.id}
          value={this.state.text}
          onChange={(e,newValue)=>{this.setState({text:newValue})}}
          fullWidth={true}
          autoFocus={(this.props.focus === this.props.comment.id)}
          onKeyPress={this.editComment}
        />
      )
    } else {
      return (
        <p>{this.props.comment.text}</p>
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
    let {author, timestamp, type, id, upvotes, children} = this.props.comment
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
              hideLink={(this.props.tabs === 'view')}
            >
              Edit
            </BotLink>
            <BotLink
              hideLink={(this.props.tabs === 'view')}
            >
              Delete
            </BotLink>
            <UpVote
              secondary={(type==='COMMENT')}
              hideLink={(this.props.tabs === 'listen')}
            >
              Upvote | {upvotes}
            </UpVote>
            <BotLink
              hideLink={(this.props.tabs === 'listen')}
            >
              Comments {children.edges.length}
            </BotLink>
          </Bottom>
        </Center>
        <Time>
          {formatTime(timestamp)}
        </Time>
      </Single>
    )
  }
}


export default SingleComment
