import React from 'react'

import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'

import {ProfileProjectItem, Left as ProjectLeft, ProfileArtwork, Info, ProfileProjectTitle, Duo, DuoItem, Bubble, CreatedAt} from 'styled/ProjectList'
import {url} from 'config'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'

export const ProjectItemSm = ({User, project, comments, likes}) => {
  return (
  <ProfileProjectItem key={project.id} >
    <ProjectLeft>
      <ProfileArtwork
        src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
        alt={'Project Artwork'}
        to={`/${User.handle}/${project.title}`} />
      <Info>
        <ProfileProjectTitle
          to={`/${User.handle}/${project.title}`} >
          {project.title}
        </ProfileProjectTitle>
        <CreatedAt>
          Created {new Date(Date.parse(project.createdAt)).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
          })}
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
