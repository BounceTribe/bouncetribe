import styled from 'styled-components'
import React from 'react'
import {purple, white, grey800, grey500, grey200, grey300, blue} from 'theme'
import {BtLink} from 'styled'

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
  background-color: ${({comment})=>(comment)? blue : purple};
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 100%;
`

export const ProfContainer = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  margin-top: 20px;

`

export const ProfTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`

const PortImg = styled.img`
  display: flex;
  height: 90px;
  width: 90px;
  border-radius: 90px;
  object-fit: cover;
`

export const Portrait = (props) => {
  return (
    <BtLink
      to={props.to}
    >
      <PortImg
        src={props.src}
      />
    </BtLink>
  )
}

export const ProfLeft = styled.div`
  display: flex;
  flex-direction: row;
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
  flex-direction: row;
  color: ${grey500};
  font-size: 18px;
  font-weight: 400;
`

export const MoreInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
  color: ${grey500};
`

export const Divider = styled.hr`
  border: .5px solid ${grey200};
  background-color: ${grey200};
  width: 100%;
`

export const CommonInfluences = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 50%;
  margin-left: 50%;
`

export const InfluenceChip = styled.div`
  display: flex;
  color: black;
  background-color: ${grey300};
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  font-size: 12px;
  margin-left: 5px;
`
