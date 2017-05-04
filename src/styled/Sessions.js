import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey200, grey700, grey800} from 'theme'

export const MatchList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 40px;
`

export const MatchCard = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 30%;
  margin-left: 2%;
  border: 1px solid ${grey200};
  border-radius: 10px;
  padding-bottom: 10px;
`

export const CardArt = styled.img`
  display: flex;
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 10px;
`

export const CreatorPortrait = styled.img`
  display: flex;
  height: 55px;
  width: 55px;
  object-fit: cover;
  border-radius: 55px;
  margin-left: 10px;
`

export const ProjectArtThumb = styled(CreatorPortrait)`
  border-radius: 0;
`

export const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  justify-content: center;
  height: 55px;
`

export const ListHandle = styled(BtLink)`
  font-size: 16px;
  color: ${grey800};
  font-weight: 400;
`

export const ListScore = styled.h2`
  display: flex;
  margin: 0;
  font-weight: bold;
  color: ${grey800};
`

export const ListProject = styled(BtLink)`
  font-size: 14px;
  color: ${grey700};
`

export const Handle = styled(BtLink)`
  font-size: 18px;
  margin-bottom: 3px;
`

export const Location = styled.h4`
  display: flex;
  flex-direction: row;
  font-size: 11px;
  color: ${grey700};
  font-weight: 200;
  margin: 0;
`
