import React, {Component} from 'react'
import {Single, Bottom, Time, Text, Center, Handle} from 'styled/Comments'
import {RoundButton} from 'styled'
import Heart from 'icons/Heart'
import formatTime from 'utils/formatTime'
import TextField from 'material-ui/TextField'

class SingleComment extends Component {

  state = {
    text: ""
  }

  componentWillMount(){
    this.setState({text: this.props.comment.text})
    if (this.props.canEdit){
      this.setState({canEdit:true})
    }
  }

  text = () => {
    if (this.state.canEdit) {
      return (
        <TextField
          id={this.props.id}
          value={this.state.text}
          onChange={(e,newValue)=>{this.setState({text:newValue})}}
          fullWidth={true}
        />
      )
    } else {
      return (
        <p>{this.state.text}</p>
      )
    }
  }

  render() {
    let {author, text, timestamp, type, id} = this.props.comment
    return (
      <Single
        id={id}
      >
        <RoundButton
          icon={
            <Heart
              height={25}
              width={25}
              style={{
                margin: '30px 0'
              }}
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
            Hello
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
