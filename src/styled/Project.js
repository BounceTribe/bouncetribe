import styled from 'styled-components'
import React from 'react'
import {purple, white, blue, grey200, grey300, grey500, grey800} from 'theme'
import {BtLink} from 'styled'

export const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 60px;
  padding-top: ${({isOwner}) => (isOwner) ? '60px' : '0'}
`

export const Art = styled.img`
  display: flex;
  width: 250px;
  height: 250px;
  cursor: ${({ownProject}) => (ownProject) ? 'pointer' : ''};
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
  margin-top: 30px;
`

export const Title = styled.div`
  display: flex;
  font-size: 30px;
  font-weight: 300;
  white-space: nowrap;
  color: ${grey800};
`

export const Genre = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 12px;
  color: ${white};
  background-color: ${purple};
  padding: 4px 10px;
  border-radius: 4px;
  vertical-align: middle;
  margin-left: 15px;
  flex-wrap: nowrap;
`

export const Summary = styled.pre`
  display: flex;
  font-size: 14px;
  margin-top: 30px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  color: #555555;
`
export const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${'' /* max-width: 900px; */}
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
  background-color: ${({comment})=>(comment)? blue : purple};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export const Bot = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px;
`

export const LeftList = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  width: 30%;
  margin-right: 20px;
`
export const CommentContainer = styled.div`
  display: flex;
  margin-left: 20px;
  width: 100%;
`

export const ProfContainer = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`

export const ProfTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: 10px;
`

const PortImg = styled.img`
  display: flex;
  height: 90px;
  width: 90px;
  border-radius: 90px;
  object-fit: cover;
`

export const Portrait = (props) => (
  <BtLink to={props.to} >
    <PortImg src={props.src} />
  </BtLink>
)

export const ProfLeft = styled.div`
  display: flex;
`

export const ProfCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
`

export const ProfHandle = styled(BtLink)`
  display: flex;
  color: ${purple};
  font-size: 20px;
  font-weight: 400;
`

export const Score = styled.div`
  display: flex;
  color: ${grey500};
  font-size: 18px;
  font-weight: 400;
`

export const MoreInfo = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
  color: ${grey500};
  font-weight: 300;
  margin-bottom: 5px;
`

export const Divider = styled.hr`
  border: 1px solid ${grey200};
  background-color: ${grey200};
  width: 100%;
`

export const CommonInfluences = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 50%;
  margin-left: 50%;
`

export const InfluenceChip = styled.div`
  display: flex;
  color: ${grey800};
  background-color: ${grey300};
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  font-size: 14px;
  margin-left: 5px;
`
