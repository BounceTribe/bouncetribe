import React from 'react'
import styled from 'styled-components'
import {white, grey400, grey500, purple} from 'theme'

export const MsgsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  max-height: 50vh;
  overflow-x: scroll;
  padding: 20px 20px 1px 20px;
  border-bottom: 1px solid ${grey500};
  bottom: 0;
`
const MsgBubble = styled.div`
  display: flex;
  border-radius: 5px;
  border: 1px solid ${grey500};
  background-color: ${props => props.receiving ? white : purple};
  color: ${props => props.receiving ? grey500 : white};
  padding: 9px 14px;
  word-break: break-word;
  white-space: pre-wrap;
  flex: none;
`
const MsgTime = styled.div`
  display: flex;
  flex: none;
  align-self: ${props => props.receiving ? 'flex-start' : 'flex-end'};
  padding: 6px 15px 13px 11px;
  color: ${grey400};
  font-size: 14px;
  text-align: ${props => props.receiving ? 'left' : 'right'};
`
const MsgItem = styled.div`
  display: flex;
  flex: none;
  align-self: ${props => props.receiving ? 'flex-start' : 'flex-end'};
  max-width: 49%;
  flex-direction: column;
`

const mapMessages = (messages) => (
  messages.map( (msg) =>
    <MsgItem key={msg.id} receiving={msg.receiving}>
      <MsgBubble receiving={msg.receiving}>
        {msg.text}
      </MsgBubble>
      <MsgTime receiving={msg.receiving}>
        {msg.time}
      </MsgTime>
    </MsgItem>
  )
)

export const BtMessages = ({msgList, lastEl}) => {
  return (
    <MsgsContainer>
      {lastEl}
      {mapMessages(msgList)}
    </MsgsContainer>)
}
