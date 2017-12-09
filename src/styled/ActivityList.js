import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router'
import {url} from 'config'
import {BtLink, BtFlatButton} from 'styled'
import {grey300, grey500, purple, white} from 'theme'

export const NameLink = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  color: #4A4A4A;
  &:hover{color: ${purple};}
`

export const ScrollBox = styled.div`
  padding: 0 0 5px 0;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
`
  const ActivityContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${grey300};
    padding: 10px 20px;
  `
  const ActivityPanelRow = styled(BtLink)`
    display: flex;
    align-items: center;
    &:hover > div {color: ${purple}}
  `
  const ActivityDashRow= styled.div`
    display: flex;
    align-items: center;
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
    const ProjectContainer = styled.div`
      display: flex;
      align-items: center;
      padding: 10px 0 10px 70px;
    `
      const ProjectArt = styled.img`
        display: flex;
        width: 180px;
        height: 180px;
        padding: 10px;
        cursor: pointer;
      `
      const ProjectDetail = styled.div`
        display: flex;
        flex-direction: column;
        padding: 10px
      `
        const DetailHeading = styled.div`
          color: #777777;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 2px;
        `
        const DetailTitle = styled.div`
          color: #333333;
          font-size: 36px;
          font-weight: 300;
          padding: 10px 0 15px 0;
          letter-spacing: 0;
        `

    const DashProject = ({project, urlPush}) => {
      let {artwork, title} = project
      return (
        <ProjectContainer>
          <ProjectArt
            src={artwork ? artwork.url : `${url}/artwork.png`}
            onClick={urlPush}
          />
          <ProjectDetail>
            <DetailHeading>NEW PROJECT ADDED</DetailHeading>
            <DetailTitle>{title}</DetailTitle>
            <BtFlatButton
              label={'Listen Now'}
              backgroundColor={purple}
              labelStyle={{color: white}}
              onClick={urlPush}
            />
          </ProjectDetail>
        </ProjectContainer>
      )
    }


export const Activity = ({date, icon, text, link, dash, project, urlPush}) => {
  let formattedDate = date
    .toLocaleDateString('en-US', {month: 'short', 'day': 'numeric'})
    //this ias where the Link nesting issue is
    if (dash) {
      return (
        <ActivityContainer>
          <ActivityDashRow>
            <ActivityDate>{formattedDate}</ActivityDate>
            <ActivityIcon>{icon}</ActivityIcon>
            <ActivityText>{text}</ActivityText>
          </ActivityDashRow>
          <ActivityDashRow>
            {project && <DashProject project={project} urlPush={urlPush}/>}
          </ActivityDashRow>
        </ActivityContainer>
      )
    } else {
      return (
        <ActivityContainer>
          <ActivityPanelRow to={link ? link : null}>
            <ActivityDate>{formattedDate}</ActivityDate>
            <ActivityIcon>{icon}</ActivityIcon>
            <ActivityText>{text}</ActivityText>
          </ActivityPanelRow>
        </ActivityContainer>
      )
    }

}
