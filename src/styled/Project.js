import styled from 'styled-components'
import {purple, white, grey800} from 'theme'

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
  margin-top: 30px;
`

export const Title = styled.div`
  display: flex;
  font-size: 25px;
  color: ${grey800};
`

export const Genre = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 12px;
  color: ${white};
  background-color: ${purple};
  padding: 5px 10px;
  border-radius: 3px;
  vertical-align: middle;
  margin-left: 15px;
`

export const Summary = styled.p`
  display: flex;
  font-size: 15px;
  margin-top: 30px;
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
  border-top: 1px solid lightgrey;
  padding-top: 5px;
`

export const Marker = styled.div`
  position: absolute;
  left: ${props => props.left}%;
  margin-left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: ${purple};
`

export const Bot = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 50px;
  width: 85%;
`

export const LeftList = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  width: 30%;
  margin-right: 20px;

`

export const CommentContainer = styled.div`
  display: flex;
  margin-left: 20px;
  width: 70%;
`
