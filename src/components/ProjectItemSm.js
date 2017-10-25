import React from 'react'

import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'

import {ProfileProjectItem, Left as ProjectLeft, ProfileArtwork, Info, ProfileProjectTitle, Duo, DuoItem, Bubble, CreatedAt} from 'styled/ProjectList'
import {url} from 'config'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import * as moment from 'moment'

export const ProjectItemSm = ({User, project, comments, likes, bounceTab}) => {
  let created = moment.default(project.createdAt).format('MMMM Do')
  console.log('projectSM', project);
  let projectLink = `/${project.creator.handle}/${project.title}`
  return (
  <ProfileProjectItem key={project.id} >
    <ProjectLeft>
      <ProfileArtwork
        src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
        alt={'Project Artwork'}
        to={projectLink} />
      <Info>
        <ProfileProjectTitle
          to={projectLink} >
          {project.title}
        </ProfileProjectTitle>
        <CreatedAt>
          {bounceTab ? User.handle : 'Created ' + created}
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
        </Duo>
      </Info>
    </ProjectLeft>
  </ProfileProjectItem>
)
}
