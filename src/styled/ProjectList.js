import styled from 'styled-components'
import {Item} from 'styled/list'
import {Link} from 'react-router'

export const ProjectItem = styled(Item)`
  height: 200px;
  align-items: center;
  padding: 20px 40px;
  border-right: none;
  border-left: none;
  border-radius: 0;
  font-size: 21px;
`

export const Left = styled.div`
  display: flex;
`
export const Artwork = styled.img`
  height: 160px;
  width: 160px;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
`

export const ProjectTitle = styled(Link)`
  text-decoration: none;
  color: grey;
  cursor: pointer;
  margin-top: 15px;
`

export const Trio = styled.div`
  display: flex;
  margin-top: 30px;
`

export const TrioItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
`
