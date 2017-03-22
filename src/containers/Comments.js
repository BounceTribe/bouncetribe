import React, {Component} from 'react'
import Relay from 'react-relay'
// import TextField from 'material-ui/TextField'
import {RoundButton} from 'styled'
import {Container, ButtonRow, ButtonColumn, ButtonLabel, CommentBox} from 'styled/Comments'
import CreateComment from 'mutations/CreateComment'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'
import {getProjectId} from 'utils/graphql'

class Comments extends Component {

  state = {
    comment: ''
  }

  constructor(props) {
    super(props)
    let {userHandle, projectTitle} = this.props.params
    getProjectId(userHandle, projectTitle).then( (projectId) => {
      this.setState({projectId})
    })
  }


  dropMarker = (type) => {
    this.props.relay.commitUpdate(
      new CreateComment({
        text: this.state.comment,
        timestamp: this.props.time,
        authorId: this.props.viewer.user,
        projectId: this.state.projectId,
        type
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
              icon={
                <Comment
                  height={40}
                  width={40}
                />
              }
              onTouchTap={()=>{this.dropMarker('COMMENT')}}
            />
            <ButtonLabel>
              Idea
            </ButtonLabel>
          </ButtonColumn>
          <ButtonColumn>
            <RoundButton
              icon={
                <Heart
                  height={40}
                  width={40}
                />
              }
              onTouchTap={()=>{this.dropMarker('LIKE')}}
            />
            <ButtonLabel>
              Like
            </ButtonLabel>
          </ButtonColumn>
        </ButtonRow>
        <CommentBox
          hide={(ownProject)}
        >


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
            id
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
