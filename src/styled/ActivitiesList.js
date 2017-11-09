import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey300, grey500, grey700, purple} from 'theme'
import React from 'react'
import {BtAvatar, IconTextContainer, IconText} from 'styled'

export const ActivitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${'' /* flex-wrap: wrap; */}
  ${'' /* align-items: flex-start; */}
  ${'' /* justify-content: flex-start; */}
  ${'' /* padding: 10px; */}
  ${'' /* width: 100%; */}
  ${'' /* box-sizing: border-box; */}
  overflow-y: scroll;
`
/* Tribe - Gave Feedbac: */

const ActivityContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid ${grey300};
  width: 100%;
  padding: 15px 20px;
  overflow-y: scroll;
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
export const Activity = ({date, icon, text}) => {
  let formattedDate = new Date(Date.parse(date))
    .toLocaleDateString('en-US', {month: 'short', 'day': 'numeric'})

  return (
    // <BtLink to={null}>
      <ActivityContainer>
        <ActivityDate>{formattedDate}</ActivityDate>
        <ActivityIcon>{icon}</ActivityIcon>
        <ActivityText>{text}</ActivityText>
      </ActivityContainer>
    // </BtLink>
  )
}

// const Activity = styled.h4`
//   margin: 0;
//   color: ${purple};
//   font-size: 17px;
//   flex: 2;
// `
//
// const NotifyMessage = styled.div`
//   font-size: 15px;
//   color: ${grey700};
//   margin-bottom: 4px;
//   flex: 3;
// `
