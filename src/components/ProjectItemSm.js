import React from 'react'

import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'

import {ProfileProjectItem, Left as ProjectLeft, ProfileArtwork, Info, ProfileProjectTitle, Duo, DuoItem, Bubble, CreatedAt} from 'styled/ProjectList'
import {url} from 'config'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import Bounce from 'icons/Bounce'
import * as moment from 'moment'

export const ProjectItemSm = ({User, project, comments, likes, bounces, bounceTab}) => {
  let created = moment.default(project.createdAt).format('MMMM Do')
  let projectLink = `/${project.creator.handle}/${project.title}`
  return (
    <ProfileProjectItem key={project.id} >
      <ProjectLeft>
        <ProfileArtwork
          src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
          alt={'Project Artwork'}
          to={projectLink} />
        <Info>
          <ProfileProjectTitle to={projectLink} >
            {project.title}
          </ProfileProjectTitle>
          <CreatedAt>
            {bounceTab ? project.creator.handle : 'Created ' + created}
          </CreatedAt>
          <Duo>
            <DuoItem>
              <Bubble secondary >
                <Comment height={15} width={15} />
              </Bubble>
              {comments.length}
            </DuoItem>
            <DuoItem>
              <Bubble>
                <Heart height={15} width={15} />
              </Bubble>
              {likes.length}
            </DuoItem>
            <DuoItem>
              <Bubble>
                <Bounce style={{margin: '1px 0 0 3px'}} width={17} />
              </Bubble>
              {bounces.length}
            </DuoItem>
          </Duo>
        </Info>
      </ProjectLeft>
    </ProfileProjectItem>
  )
}
