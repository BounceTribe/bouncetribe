import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import {Button} from 'styled'
import CreateComment from 'mutations/CreateComment'

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
    return this.props.project.comments.edges.map(edge=>{
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
    fragments: {
      project: () => Relay.QL`
        fragment on Project {
          id
          title
          comments (
            first: 1000
          ) {
            edges {
              node {
                text
                id
                timestamp
              }
            }
          }
        }
      `,
      self: () => Relay.QL`
        fragment on User {
          id
        }
      `,
    },
  }
)
