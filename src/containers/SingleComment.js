import React, {Component} from 'react'
import {Single, Bottom, Time, Text, Center, Handle} from 'styled/Comments'
import {RoundButton} from 'styled'
import Heart from 'icons/Heart'

class SingleComment extends Component {
  render() {
    let {author, text, timestamp, type} = this.props.comment
    return (
      <Single>
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
            {text}
          </Text>
          <Bottom>
            Hello
          </Bottom>
        </Center>
        <Time>
          {timestamp}
        </Time>
      </Single>
    )
  }
}


export default SingleComment
