import styled from 'styled-components'
import React from 'react'
import {grey300, grey700, grey900, blue, purple} from 'theme'
import {BtLink} from 'styled'

export const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
`
export const ButtonRow = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  flex-direction: row;
  justify-content: center;
`

export const ButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  align-items: center;
`

export const ButtonLabel = styled.span`
  display: flex;
  margin-top: 15px;
  font-size: 14px;
`

export const CommentBox = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const Single = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid ${grey300};
  border-radius: 6px;
  padding: 10px 30px;
  width: 100%;
  margin-bottom: 20px;
  min-height: 40px;
  box-sizing: border-box;
  display: ${({hide})=> (hide) ? 'none': ''};
`

export const Bottom = styled.div`
  font-size: 13px;
`

export const BotLink = styled.span`
  cursor: pointer;
  color: ${grey700};
  display: ${({hideLink})=> (hideLink) ? 'none': ''};
  margin-right: 10px;
  font-size: 12px;
`

export const UpVote = styled(BotLink)`
  color: ${({secondary}) => (secondary) ? blue: purple};
  font-weight: bold;
`

export const Time = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  font-size: 14px;
  color: ${grey700};
  margin-top: 40px;
`

export const Center = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin-left: 20px;
  width: 90%;
  flex-wrap: wrap;
`

export const CommentP = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${grey700};
`

export const Text = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  text-align: left;
  font-size: 16px;
  color: ${grey900};
  align-items: flex-start;
  align-content: center;
  min-height: 50px;
  font-size: 16px;
  margin-top: 40px;
`

export const Handle = styled(BtLink)`
  display: flex;
  color: ${({comment}) => (comment) ? blue : purple};
  margin-right: 10px;
  font-weight: 400;
`

export const CommentScroller = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

export const SCContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 15px;
`

export const SubComment = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
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

export const SCHandle = (props) => {
  return(
    <BtLink
      to={props.to}
    >
      <SCHandleText>
        {props.children}
      </SCHandleText>
    </BtLink>
  )
}

export const SCText = styled.div`
  display: flex;
  color: ${grey700};
  margin-top: 10px;
  font-size: 13px;
`
