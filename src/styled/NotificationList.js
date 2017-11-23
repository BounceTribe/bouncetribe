import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey300, grey500, grey700, purple} from 'theme'
import React from 'react'

export const NotifyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${grey300};
  width: 100%;
  padding: 10px 20px;
`

export const NotifyHeader = styled.h4`
  margin: 0;
  color: ${purple};
  font-size: 17px;
  flex: 2;
`

export const NotifyMessage = styled.div`
  font-size: 15px;
  color: ${grey700};
  margin-bottom: 4px;
  flex: 3;
`

export const NotifyDate = styled.div`
  font-size: 11px;
  color: ${grey500};
  flex: 1;
`

export const Notification = ({notification: {type, triggeredBy, createdAt, notificationFor, project, session}}) => {
  console.log('notifi', type, project);
  let header,
      message,
      link

  switch (type) {
    case 'FRIEND_REQUEST': {
      header = "Tribe Request"
      message = `${triggeredBy.handle} has invited you to join their Tribe`
      link = `/${triggeredBy.handle}`
      break
    }
    case 'FRIEND_REQUEST_ACCEPTED': {
      header = "Request Accepted"
      message = `${triggeredBy.handle} has accepted`
      link = `/${triggeredBy.handle}`
      break
    }
    case 'SESSION_FEEDBACK_RECEIVED': {
      header = 'Feedback Received'
      message = `${triggeredBy.handle} has given you feedback`
      link = `/session/${notificationFor.handle}/${session.id}/mine`
      break
    }
    case 'PROJECT_FEEDBACK_RECEIVED': {
      header = 'Feedback Received'
      message = `${triggeredBy.handle} has given you feedback`
      link = `/${notificationFor.handle}/${project.title}`
      break
    }
    case 'SESSION_FEEDBACK_APPRECIATED': {
      break
    }
    case 'FB_FRIEND_JOINED': {
      break
    }
    case 'MESSAGE': {
      break
    }
    case 'BOUNCED': {
      header = 'Project Bounced'
      message = `${triggeredBy.handle} has bounced your track.`
      link = `/${notificationFor.handle}/${project.title}`
      break
    }
    default: {
    }
  }

  return (
    <BtLink to={link}>
      <NotifyContainer>
        <NotifyHeader>
          {header}
        </NotifyHeader>
        <NotifyMessage>
          {message}
        </NotifyMessage>
        <NotifyDate>
          {new Date(Date.parse(createdAt)).toLocaleDateString('en-US', {month: 'long', 'day': 'numeric'})}
        </NotifyDate>
      </NotifyContainer>
    </BtLink>
  )
}
