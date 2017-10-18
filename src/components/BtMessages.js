import React from 'react'
import styled from 'styled-components'
import {white, grey400, grey500, purple} from 'theme'
import * as moment from 'moment'

export const MsgsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: 'flex-end';
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid ${grey500};
`
const MsgBubble = styled.div`
  display: flex;
  border-radius: 5px;
  border: 1px solid ${grey500};
  background-color: ${props => props.isSender ? white : purple};
  color: ${props => props.isSender ? grey500 : white};
  padding: 9px 14px;
  flex-wrap: wrap;
  word-break: break-word;
`
const MsgTime = styled.div`
  display: flex;
  align-self: ${props => props.isSender ? 'flex-start' : 'flex-end'};
  padding: 6px 15px 13px 11px;
  color: ${grey400};
  font-size: 14px;
  text-align: ${props => props.isSender ? 'left' : 'right'};
`
const MsgItem = styled.div`
  display: flex;
  align-self: ${props => props.isSender ? 'flex-start' : 'flex-end'};
  max-width: 49%
  flex-direction: column;
`

const BtMessage = ({isSender, text, time}) => (
  <MsgItem isSender={isSender}>
    <MsgBubble isSender={isSender}>
      {text}
    </MsgBubble>
    <MsgTime isSender={isSender}>
      {time}
    </MsgTime>
  </MsgItem>
)

const messageDisplay = (messages, senderId) => (
  messages.map(msg => {
    msg = msg.node
    let time
    let created = moment.default(msg.createdAt)
    if (created.add(12, 'hours') > moment.now()) {
      time = created.subtract(12, 'hours').format('h:mm a')
    } else {
      time = created.subtract(12, 'hours').format('MMMM Do h:mm a')
    }
    return (
      <BtMessage
        key={msg.id}
        text={msg.text}
        time={time}
        isSender={msg.sender.id===senderId}
      />
    )
  })
)

export const BtMessages = ({msgList, senderId}) => (
  <MsgsContainer>
    {messageDisplay(msgList, senderId)}
  </MsgsContainer>
)
