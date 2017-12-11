import styled from 'styled-components'
import React from 'react'
import {grey300, grey700, grey900, blue, purple} from 'theme'
import {BtLink} from 'styled'

export const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 80px;
  width: ${({listenTab}) => (listenTab) ? '85%' : '100%'};
`
  export const ButtonRow = styled.div`
    display: ${({hide}) => (hide) ? 'none' : 'flex'};
    justify-content: center;
  `
    export const ButtonColumn = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px 10px;
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
  padding: 20px;
`
export const Single = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 1.5s ease-out;
  border: 1px solid ${grey300};
  border-radius: 6px;
  width: 100%;
  margin: 10px;
  display: ${({hide}) => (hide) ? 'none': ''};
  min-width: 0;
`
  export const MainRow = styled.div`
    display: flex;
    padding: 12px 30px 10px 20px;
  `
  export const Bottom = styled.div`
    display: flex;
    font-size: 13px;
    ${'' /* padding-top: 5px; */}
    position: absolute;
    align-self: flex-end;
  `
    export const InfoOptions = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
    `
      export const InfoRow = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
      `
        export const Handle = styled(BtLink)`
          color: ${({comment}) => (comment) ? blue : purple};
          position: absolute;
          ${'' /* align-self: flex-end; */}
          margin-left: 75px;
          font-weight: 400;
        `


        export const BotLink = styled.span`
          cursor: pointer;
          color: ${grey700};
          display: ${({hideLink}) => hideLink ? 'none': ''};
          padding: 0 5px;
          font-size: 12px;
        `
        export const UpVote = styled(BotLink)`
          color: ${({secondary, hasUpvoted}) => {
            if (hasUpvoted) return '#999999'
            if (secondary) return blue
            else return purple
          }};
          font-weight: bold;
        `
    export const Text = styled.pre`
      display: flex;
      flex-direction: column;
      color: ${grey900};
      font-size: 16px;
      ${'' /* align-self: center; */}
      margin: 25px 0 0 0;
      word-break: break-all;
      padding: 0 20px;
      white-space: pre-wrap;
      flex-grow: 1;
    `
    export const Time = styled.div`
      font-size: 14px;
      display: flex;
      flex-direction: column;
      margin-bottom: 17px;
      color: ${grey700};
      margin-left: auto;
      align-self: center;
      cursor: pointer;
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
  padding: 0 30px 0 60px;
`

export const SubComment = styled.div`
  display: flex;
  padding: 10px 0;
  display: ${({hide}) => (hide) ? 'none': ''};
`

export const SCCol = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  justify-content: flex-start;
`

export const SCHandleText = styled.pre`
  display: flex;
  font-weight: 400;
  color: ${grey700};
  font-size: 14px;
  margin: 0;
`

export const SCHandle = (props) => (
  <BtLink to={props.to}>
    <SCHandleText>{props.children}</SCHandleText>
  </BtLink>
)

export const SCBottom = styled.div`
  display: flex;
  margin-top: auto;
  font-size: 13px;
  padding-top: 5px;
  ${'' /* justify-content: flex-end; */}
`
export const SCText = styled.div`
  display: flex;
  color: ${grey700};
  font-size: 13px;
  padding: 7px;

`
