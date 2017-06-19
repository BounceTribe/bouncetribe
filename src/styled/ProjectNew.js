import styled from 'styled-components'
import {grey300, grey500} from 'theme'

export const TrackContainer = styled.div`
  width: 80%;
  max-width: 800px;
  margin: 50px 0;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  padding-bottom: 60px;
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 60%;
  margin-left: 80px;
  margin-right: 120px;
`

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  margin-top: 20px;
  margin-right: 80px;
`

export const Sharing = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`
export const SharingModal = styled(Sharing)`
  width: 300px;
`

export const Choice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
`


export const ChoiceText = styled.span`
  display: flex;
  margin-top: 14px;
  color: ${grey500};
`

export const ArtworkDrop = styled.img`
  display: flex;
  justify-content: center;
  border: 1px solid ${grey300};
  background-color: #F7F7F7;
  height: 350px;
  width: 350px;
  cursor: pointer;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
