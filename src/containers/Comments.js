import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {Button} from 'styled'
import CreateComment from 'mutations/CreateComment'
import CommentMarkers from 'components/CommentMarkers'

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
        <div
          key={comment.id}
        >
          {comment.text}
          {comment.timestamp}
        </div>
      )
    })
  }

  render () {
    return (
      <div>
        <CommentMarkers
          comments={this.props.viewer.allComments}
          duration={this.state.duration}
        />
        <TextField
          name={'comment'}
          multiLine={true}
          rows={2}
          onChange={(e)=>{this.setState({comment: e.target.value})}}
        />
        <Button
          primary
          label={'Comment'}
          onClick={this.createComment}
        />

        <div>
          {this.comments}
        </div>
      </div>
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
