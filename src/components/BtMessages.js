import React, {Component} from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'

import {white, grey400, grey500, purple} from 'theme'

export const MsgsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: 'flex-end';
  max-height: 400px;
  overflow: scroll;
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
  word-break: break-word;
  flex: none;
`
const MsgTime = styled.div`
  display: flex;
  flex: none;
  align-self: ${props => props.isSender ? 'flex-start' : 'flex-end'};
  padding: 6px 15px 13px 11px;
  color: ${grey400};
  font-size: 14px;
  text-align: ${props => props.isSender ? 'left' : 'right'};
`
const MsgItem = styled.div`
  display: flex;
  flex: none;
  align-self: ${props => props.isSender ? 'flex-start' : 'flex-end'};
  max-width: 49%
  flex-direction: column;
`

const mapMessages = (messages) => (
  messages.map( (msg) =>
    <MsgItem key={msg.id} isSender={msg.isSender}>
      <MsgBubble isSender={msg.isSender}>
        {msg.text}
      </MsgBubble>
      <MsgTime isSender={msg.isSender}>
        {msg.time}
      </MsgTime>
    </MsgItem>
  )
)

export class BtMessages extends Component {

  render() {
    return (
      <MsgsContainer>
        {mapMessages(this.props.msgList)}
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.msgsEnd = el}}>
        </div>
      </MsgsContainer>
    )
  }
}
