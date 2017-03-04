import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {RoundButton} from 'styled'
import {Container, ButtonRow, ButtonColumn, ButtonLabel, CommentBox} from 'styled/Comments'
import CreateComment from 'mutations/CreateComment'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'

class Comments extends Component {

  state = {
    comment: ''
  }


  createComment = () => {
    this.props.relay.commitUpdate(
      new CreateComment({
        text: this.state.comment,
        timestamp: this.props.time,
        self: this.props.self,
        project: this.props.project
      }), {
        onSuccess: success => success,
        onFailure: failure => failure
      }
    )
  }

  get comments () {
    return this.props.viewer.allComments.edges.map(edge=>{
      let {node: comment} = edge
      return (
        <SingleComment
          comment={comment}
          key={comment.id}
        />
      )
    })
  }

  render () {
    let ownProject = (this.props.viewer.user.handle === this.props.params.userHandle)
    return (
      <Container>
        <CommentMarkers
          comments={this.props.viewer.allComments}
          duration={this.state.duration}
        />
        <ButtonRow
          hide={(ownProject)}
        >
          <ButtonColumn>
            <RoundButton
              secondary
              icon={<Comment/>}
            />
            <ButtonLabel>
              Idea
            </ButtonLabel>
          </ButtonColumn>
          <ButtonColumn>
            <RoundButton
              icon={<Heart/>}
            />
            <ButtonLabel>
              Like
            </ButtonLabel>
          </ButtonColumn>
        </ButtonRow>
        <CommentBox
          hide={(ownProject)}
        >
          <RoundButton
            icon={
              <Comment
                height={25}
                width={25}
              />
            }
            onClick={this.createComment}
            mini={true}
            secondary
          />
          <TextField
            name={'comment'}
            style={{marginLeft: '15px'}}
            multiLine={true}
            fullWidth={true}
            rows={2}
            onChange={(e)=>{this.setState({comment: e.target.value})}}
          />

        </CommentBox>

        {this.comments}

      </Container>
    )
  }
}

export default Relay.createContainer(
  Comments, {
    initialVariables: {
      commentFilter: {}
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            handle
          }
          allComments (
            first: 50
            filter: $commentFilter
          ) {
            edges {
              node {
                id
                type
                text
                author {
                  handle
                }
                timestamp
              }
            }
          }
        }
      `,
    },
  }
)
