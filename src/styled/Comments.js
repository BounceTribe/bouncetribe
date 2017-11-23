import styled from 'styled-components'
import React from 'react'
import {grey300, grey700, grey900, blue, purple} from 'theme'
import {BtLink} from 'styled'

export const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
`
export const ButtonRow = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  justify-content: center;
`

export const ButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ButtonLabel = styled.span`
  display: flex;
  margin-top: 15px;
  font-size: 14px;
`

export const CommentBox = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  justify-content: space-between;
  align-items: center;
  width: 100%;
`


export const CommentP = styled.p`
  font-size: 16px;
  color: ${grey700};
`

export const Single = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 1.5s ease-out;
  border: 1px solid ${grey300};
  border-radius: 6px;
  width: 100%;
  margin: 10px;
  display: ${({hide})=> (hide) ? 'none': ''};
  min-width: 0;
`
  export const MainRow = styled.div`
    display: flex;
    padding: 20px 30px;
    min-width: 0;
  `
    export const InfoOptions = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      width: 170px;
    `
      export const Handle = styled(BtLink)`
        display: flex;
        color: ${({comment}) => (comment) ? blue : purple};
        padding-right: 10px;
        margin-top: auto;
        font-weight: 400;
      `
      export const Bottom = styled.div`
        margin-top: auto;
        font-size: 13px;
      `
        export const BotLink = styled.span`
          cursor: pointer;
          color: ${grey700};
          display: ${({hideLink})=> (hideLink) ? 'none': ''};
          padding-right: 10px;
          font-size: 12px;
        `
        export const UpVote = styled(BotLink)`
          color: ${({secondary}) => (secondary) ? blue: purple};
          font-weight: bold;
        `
    export const Text = styled.div`
      display: flex;
      flex-direction: column;
      color: ${grey900};
      font-size: 16px;
      word-break: break-all;
      padding: 0 20px;
    `
    export const Time = styled.div`
      font-size: 14px;
      ${'' /* width: 60px; */}
      display: flex;
      flex-direction: column;
      color: ${grey700};
      align-self: center;
    `

export const CommentScroller = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const SCContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`

export const SubComment = styled.div`
  display: flex;
`

export const SCCol = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

export const SCHandleText = styled.div`
  display: flex;
  font-weight: 400;
  color: ${grey700};
  font-size: 14px;
`

export const SCHandle = (props) => (
  <BtLink to={props.to}>
    <SCHandleText>{props.children}</SCHandleText>
  </BtLink>
)


export const SCText = styled.div`
  display: flex;
  color: ${grey700};
  font-size: 13px;
`
