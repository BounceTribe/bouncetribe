import React, {Component} from 'react'
import {Single, Bottom, Time, Text, Center} from 'styled/Comments'
import {RoundButton} from 'styled'
import Heart from 'icons/Heart'

class SingleComment extends Component {
  render() {
    let {text, timestamp} = this.props.comment
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
        />
        <Center>
          <Text>
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
