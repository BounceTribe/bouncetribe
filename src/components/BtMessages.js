import React from 'react'
import styled from 'styled-components'
import {white, grey300 ,grey400, grey600, purple} from 'theme'

export const MsgsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  ${'' /* max-height: 50vh; */}
  overflow-x: scroll;
  padding: 20px 30px 1px 30px;
  border-bottom: 1px solid ${grey300};
  bottom: 0;
`
const MsgBubble = styled.div`
  display: flex;
  border-radius: 5px;
  border: 1px solid #E0E0E0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  background-color: ${props => props.receiving ? white : purple};
  color: ${props => props.receiving ? grey600 : white};
  padding: 16px 20px;
  word-break: break-word;
  white-space: pre-wrap;
  flex: none;
`
const MsgTime = styled.div`
  display: flex;
  flex: none;
  align-self: ${props => props.receiving ? 'flex-start' : 'flex-end'};
  padding: 10px 15px 20px 11px;
  color: ${grey400};
  font-size: 13px;
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

export const BtMessages = ({msgList, lastEl, nextPage, top}) => {
  return (
    <MsgsContainer>
      {lastEl}
      {mapMessages(msgList)}
      {nextPage}
      {top}
    </MsgsContainer>)
}
