import React from 'react'
import styled from 'styled-components'
import {BtLink} from 'styled'
import {white, grey40, grey70, grey700, grey500, grey300, purple} from 'theme'
// import Header from 'icons/Header'
import {url} from 'config'

export const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10%;
  height: 50px;
  background-color: ${grey40};
  box-sizing: border-box;
`


export const NavList = styled.div`
  display: flex;
  align-items: center;
`

export const NavLink = styled(BtLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${white};
  padding: 0 15px;
  border-right: 1px solid ${grey70};
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
`

export const Title = styled(BtLink)`
  display: flex;
  color: ${white};
`
// const Bold = styled.span`
//   display: flex;
//   font-weight: 400;
// `

export const LogoImg = styled.div`
  width: 159px;
  height: 19px;
  background-image: url(${url}/header.png);
  background-repeat: no-repeat;
  background-position: center;
`

export const Logo = (props) =>{
  return (
    <Title
      {...props}
    >
      <LogoImg/>
    </Title>
  )
}

export const NavImg = styled.img`
  display: flex;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  object-fit: cover;
`

export const ImgLink = styled(BtLink)`
  color: ${white};
  padding: 0 30px 0 15px;
`

export const Portrait = (props) => {
  return (
    <ImgLink
      {...props}
    >
      <NavImg
        {...props}
      />
    </ImgLink>
  )
}

export const NavText = styled.span`
  display: flex;
  margin-left: 4px;
`

export const NotifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${grey300};
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 20px;
`

export const NotifyHeader = styled.h4`
  margin: 0;
  color: ${purple};
  font-size: 15px;
  margin-bottom: 8px;
`

export const NotifyMessage = styled.div`
  font-size: 12px;
  color: ${grey700}
  margin-bottom: 10px;
`

export const NotifyDate = styled.div`
  font-size: 9px;
  color: ${grey500};
`

export const Notification = ({notification: {type, triggeredBy, createdAt, notificationFor, project, session}}) => {

  let header,
      message,
      link

  switch (type) {
    case 'FRIEND_REQUEST': {

      break
    }
    case 'FRIEND_REQUEST_ACCEPTED': {
      break

    }
    case 'SESSION_FEEDBACK_RECEIVED': {
      header = 'Feedback Received'
      message = `${triggeredBy.handle} has given you feedback.`
      link = `/${notificationFor.handle}/session/${session.id}/mine`
      break
    }
    case 'PROJECT_FEEDBACK_RECEIVED': {
      header = 'Feedback Received'
      message = `${triggeredBy.handle} has given you feedback.`
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
      break

    }
    default: {

    }
  }

  return (
    <BtLink
      to={link}
    >
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
