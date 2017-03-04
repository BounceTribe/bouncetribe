import styled from 'styled-components'
import {Item} from 'styled/list'
import {Link} from 'react-router'
import {grey800} from 'theme'
import React from 'react'

export const ProjectItem = styled(Item)`
  height: 200px;
  align-items: center;
  padding: 20px 40px;
  border-right: none;
  border-left: none;
  border-radius: 0;
  font-size: 21px;
  margin-bottom: 0;
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

export const Artwork = (props) => {
  return (
    <Link
      {...props}
    >
      <ArtworkImg
        {...props}
      />
    </Link>
  )
}

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

`
