import React, { Component } from 'react'
import styled from 'styled-components'
import {Link} from 'react-router'
import { btLight, btPurple} from 'styling/T'
import Bolt from 'imgs/icons/bolt'
import Notes from 'imgs/icons/notes'
import Tribe from 'imgs/icons/tribe'
import burrito from 'styling/burritocat.png'

const ProjectListItemDisplay = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  margin: 10px 1%;
  padding: 10px;
  max-width: 45.6%;
  min-width: 40%;
  border: solid ${btLight} .5px;
`

const ProjectListItemImage = styled.img`
  display: flex;
  height: 100px;
`

const ProjectListItemInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
  height: 100px;
`

const ProjectColumnTop = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: auto;
`

const ProjectListItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: flex-start;
`

const ProjectName = styled.h2`
  font-size: 1.2em;
  font-weight: normal;
  color: ${btPurple}
`

// const ProjectLocation = styled.div`
//   font-size: .9em;
//   font-weight: normal;
//   color: ${btMedium};
//   display: flex;
//   flex-direction: row;
//   align-items: baseline;
// `

const ProjectScores = styled.ul`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: baseline;
`

const ProjectScore = styled.li`
  font-size: 1em;
  margin-right: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const IconContainer = styled.div`
  display: flex;
  margin-right: 5px;
  height: 1em;
  width: 1em;
`

// const ProjectButtonColumn = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-content: flex-end;
//   justify-content: flex-end;
//   align-items: flex-end;
//   margin-left: 20px;
//   min-width: 100px;
//   height: 100px;
// `

class ProjectListItem extends Component {



  render() {
    let {
      handle,
    } = this.props.user
    let {
      title,
      artwork
    } = this.props.project
    return (
      <ProjectListItemDisplay

      >
        <ProjectListItemRow>
          <ProjectListItemImage
            src={(artwork) ? artwork.url : burrito}
            alt={'ProjectListItem'}
          />

          <ProjectListItemInfoColumn>
            <ProjectColumnTop>
              <ProjectName>
                <Link
                  to={`/${handle}/projects/${title}`}
                >
                  {title}
                </Link>
              </ProjectName>

            </ProjectColumnTop>
            <ProjectScores>
              <ProjectScore>
                <IconContainer>
                  <Bolt/>
                </IconContainer>
                <span>0</span>
              </ProjectScore>
              <ProjectScore>
                <IconContainer>
                  <Notes/>
                </IconContainer>
                <span>0</span>
              </ProjectScore>
              <ProjectScore>
                <IconContainer>
                  <Tribe/>
                </IconContainer>
                <span>0</span>
              </ProjectScore>
            </ProjectScores>

          </ProjectListItemInfoColumn>
        </ProjectListItemRow>


      </ProjectListItemDisplay>
    )
  }

}

export default ProjectListItem
