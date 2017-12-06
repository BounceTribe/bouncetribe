import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey300, grey500, purple} from 'theme'
import React from 'react'

export const ScrollBox = styled.div`
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
`
const ActivityContainer = styled(BtLink)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${grey300};
  padding: 20px 20px;
  &:hover > div {
    color: ${purple}
  }
`
const ActivityDate = styled.div`
  font-size: 12px;
  color: ${grey500};
  width: 70px;
`
const ActivityIcon = styled.div`
  padding: 0 10px;
`
const ActivityText = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: #4A4A4A;
`
export const Activity = ({date, icon, text, link}) => {
  let formattedDate = date
    .toLocaleDateString('en-US', {month: 'short', 'day': 'numeric'})
  return (
      <ActivityContainer to={link ? link : null}>
        <ActivityDate>{formattedDate}</ActivityDate>
        <ActivityIcon>{icon}</ActivityIcon>
        <ActivityText>{text}</ActivityText>
      </ActivityContainer>
  )
}
