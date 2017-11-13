import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey300, grey500} from 'theme'
import React from 'react'

const ActivityContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid ${grey300};
  padding: 20px 20px;
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
  let formattedDate = new Date(Date.parse(date))
    .toLocaleDateString('en-US', {month: 'short', 'day': 'numeric'})

  return (
    <ActivityContainer>
      <BtLink to={link ? link : null}>
        <ActivityDate>{formattedDate}</ActivityDate>
        <ActivityIcon>{icon}</ActivityIcon>
        <ActivityText>{text}</ActivityText>
      </BtLink>
    </ActivityContainer>
  )
}
