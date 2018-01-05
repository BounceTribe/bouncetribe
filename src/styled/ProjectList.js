import styled from 'styled-components'
import {Item} from 'styled/list'
import {Link} from 'react-router'
import {grey500, grey800, purple, blue} from 'theme'
import React from 'react'

export const ProjectItem = styled(Item)`
  height: 200px;
  align-items: center;
  padding: 20px 40px;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;
  font-size: 21px;
  margin-bottom: 0;
`

export const ProfileProjectItem = styled(ProjectItem)`
  height: 100px;
  padding: 10px 20px;
  border-top: none;
`

export const Left = styled.div`
  display: flex;
`
const ArtworkImg = styled.img`
  height: 160px;
  width: 160px;
  cursor: pointer;
  object-fit: cover;
`

const ProfileArtworkImg = styled(ArtworkImg)`
  height: 100px;
  width: 100px;
`

export const Bubble = styled.div`
  display: flex;
  height: 25px;
  width: 25px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  background-color: ${({secondary}) => (secondary) ? blue : purple};
  margin-right: 5px;
`

export const BigBubble = styled(Bubble)`
  height: 30px;
  width: 30px;
  border-radius: 30px;
`

export const CreatedAt = styled.div`
  color: ${grey500};
  font-size: 13px;
  margin-top: 5px;
`

export const Artwork = (props) => (
  <Link {...props} >
    <ArtworkImg {...props} />
  </Link>
)

export const ProfileArtwork = (props) => (
  <Link {...props} >
    <ProfileArtworkImg {...props} />
  </Link>
)

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 30px;
`

export const ProjectTitle = styled(Link)`
  text-decoration: none;
  font-size: 23px;
  color: ${grey800};
  cursor: pointer;
  margin-top: 20px;
  font-weight: 400;
`

export const ProfileProjectTitle = styled(ProjectTitle)`
  font-size: 20px;
  margin-top: 10px;
`

export const Trio = styled.div`
  display: flex;
  margin-top: 30px;
`

export const TrioItem = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-right: 10px;
  font-size: 16px;
  align-items: center;
  color: ${grey800};
`

export const Duo = styled(Trio)`
  margin-top: 10px;
`

export const DuoItem = styled(TrioItem)`
  font-size: 14px;
`

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 220px;
`
