import styled from 'styled-components'

export const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 60px;
`

export const Art = styled.img`
  display: flex;
  width: 250px;
  height: 250px;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 40px;
  width: 400px;
`

export const TitleGenre = styled.div`
  display: flex;
  flex-direction: row;
`

export const Summary = styled.p`
  display: flex;
`

export const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  max-width: 900px;
  justify-content: center;
  margin-bottom: 50px;
`
export const MarkerContainer = styled.div`
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  width: ${props => props.wide}px;
  height: 20px;
  border-top: 1px solid black;
  padding-top: 5px;
`

export const Marker = styled.div`
  position: absolute;
  left: ${props => props.left}%;
  margin-left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: salmon;
`
