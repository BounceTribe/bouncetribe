import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
// import TextField from 'material-ui/TextField'
import {RoundButton} from 'styled'
import {Container, ButtonRow, ButtonColumn, ButtonLabel, CommentBox, CommentScroller} from 'styled/Comments'
import CreateComment from 'mutations/CreateComment'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'
import {getProjectId} from 'utils/graphql'


class Comments extends Component {

  static contextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
  }

  state = {
    comment: '',
    comments: []
  }

  constructor(props) {
    super(props)
    let {userHandle, projectTitle} = this.props.params
    getProjectId(userHandle, projectTitle).then( (projectId) => {
      this.setState({projectId})
    })
  }


  dropMarker = (type) => {
    let timestamp = this.context.time
    this.props.relay.commitUpdate(
      new CreateComment({
        text: this.state.comment,
        authorId: this.props.viewer.user.id,
        projectId: this.state.projectId,
        type,
        timestamp
      }), {
        onSuccess: success => success,
        onFailure: failure => failure
      }
    )
    this.setState(
      (prevState,props)=> {
        let comments = props.viewer.allComments.edges.concat({node:{
          text: this.state.comment,
          authorId: this.props.viewer.user.id,
          projectId: this.state.projectId,
          type,
          timestamp,
          id: 'new',
          author: this.props.viewer.user,
          canEdit: true
        }})
        return {
          comments
        }
      },
      ()=>{
        document.getElementById('new').scrollIntoView(true)
      }
    )

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewer.allComments.edges && this.state.comments.length === 0) {
      this.setState({comments: nextProps.viewer.allComments.edges})
    }
  }

  get comments () {
    this.state.comments.sort((a, b) => {
      return a.node.timestamp - b.node.timestamp
    })
    return this.state.comments.map(edge=>{
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
          comments={this.state.comments}
          duration={this.state.duration}
        />
        <ButtonRow
          hide={((ownProject) || (this.props.router.location.pathname.includes('/view')))}
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
        <CommentScroller>
          {this.comments}
        </CommentScroller>


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
            orderBy: timestamp_ASC
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
                project {
                  id
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
