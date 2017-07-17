import styled from 'styled-components'
import {size} from './mediaQueries'
import {grey300, white} from './colors'

export const Row = styled.div`
  display: flex;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 110vh;
  ${size.m`
    display: block;
    width: 100%;
  `}
`

export const View = styled.section`
  background-color: ${white};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: 50px;
  border: solid ${grey300} .5px;
  border-radius: 10px;
  min-height: 80vh;
  margin-bottom: 50px;
`
export const FeedView = styled(View)`
  width: 65%;
`

export const ProjectNewView = styled(View)`
  min-height: 85vh;
`

export const ProfileView = styled(View)`
  background-color: transparent;
  border: none;
  padding: 60px;
`
