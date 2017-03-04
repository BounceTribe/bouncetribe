import styled from 'styled-components'
import {grey300, grey700, grey900} from 'theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
export const ButtonRow = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  flex-direction: row;
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
  align-items: center;
  border: 1px solid ${grey300};
  border-radius: 6px;
  padding: 10px 30px;
  width: 100%;
  margin-bottom: 20px;
`

export const Bottom = styled.div`
  position: absolute;
  margin-top: 30px;
  font-size: 13px;
`

export const Time = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  font-size: 14px;
  color: ${grey700};
`

export const Center = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: 20px;
  width: 100%;
`

export const Text = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  text-align: left;
  font-size: 16px;
  color: ${grey900};
  align-items: center;
  align-content: center;
  min-height: 75px;
  font-size: 16px;
`
