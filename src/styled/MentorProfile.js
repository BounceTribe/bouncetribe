import React from 'react'
import styled from 'styled-components'
import {View, Row, Col} from 'styled'
import {white, purple} from 'theme'
import {Link} from 'react-router'
import YOU_TUBE from 'icons/YOU_TUBE.png'
import SOUND_CLOUD from 'icons/SOUND_CLOUD.png'
import BEAT_PORT from 'icons/BEAT_PORT.png'

export const MentorView = styled(View)`
  flex-direction: row;
  background-color: transparent;
  border: none;
  box-shadow: none;
  width: 80%;
  min-width: 1000px;
  padding: 20px 0;
`

export const RightPanel = styled(Col)`
  background-color: ${white};
  justify-content:space-around;
  align-items: center;
  ${'' /* min-height: 40vh; */}
  border: solid #E3E3E3 1px;
  border-radius: 10px;
  margin-bottom: auto;
  padding: 35px 10px;
  max-height: 215px;
  min-height: 215px;
  width: 325px;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
  display: ${props => props.hide ? 'none' : ''};
`

  export const ReserveUpper = styled.div`
    font-size: 18px;
    font-weight: 400;
    color: #777777;
    letter-spacing: 0;
  `
  export const ReserveLower = styled.div`
    font-size: 13px;
    color: #999999;
    letter-spacing: 0;
  `

export const LeftWrapper = styled(Col)`
  margin-right: 20px;
  width: calc(100% - 345px);
  flex-shrink: 1;
`
export const UpperMain = styled(Col)`
  background-color: ${white};
  border: 1px solid #E3E3E3;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
`
  export const CenteredRow = styled(Col)`
    justify-content: center;
    align-items: center;
    padding: 30px;
  `
  export const MentorHandle = styled.div`
    font-weight: 600;
    font-size: 20px;
    color: #333333;
    padding-top: 15px;
    letter-spacing: 0;
  `
  export const Location = styled(Row)`
    font-weight: 300;
    font-size: 14px;
    margin: 10px 0px 10px 0px;
    color: #777777;
    letter-spacing: 0.3px;
  `
  export const Rating = styled(Row)`
    align-items: baseline;
    justify-content: space-between;
    ${'' /* width: 140px; */}
  `
    export const RatingVal = styled.div`
      font-size: 15px;
      color: #555555;
      letter-spacing: 0;
      padding: 0 5px;
    `
    export const NumberRatings = styled.div`
      font-size: 15px;
      font-weight: 300;
      color: #999999;
      letter-spacing: 0.5px;
    `

  export const Summary = styled.pre`
    padding: 30px;
    border-top: 1px solid #E3E3E3;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: #777777;
    word-break: break-all;
    white-space: pre-wrap;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: .5px;
    line-height: 20px;
  `

export const InfoFeed = styled(Col)`
  padding: 35px 40px;
  background-color: ${white};
  border-radius: 10px;
  border: 1px solid #E3E3E3;
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
`

  export const Text = styled.span`
    font-size: 14px;
    color: #555555;
    letter-spacing: 0;
  `

  export const MediaLinks = styled(Col)`
    font-size: 13px;
    color: #9075F3;
    padding: 10px 0;
  `
  const MediaIcon = styled.img`
    height: 50px;
    width: 50px;
    object-fit: cover;
  `
  const MediaText = styled.a`
    font-weight: 500;
    font-size: 13px;
    color: ${purple};
    letter-spacing: 0;
    text-decoration: none;
    padding-left: 15px;
  `

  const MediaRow = styled(Row)`
    align-items: center;
    padding: 18px 0;
  `

  export const MediaItem = ({url}) => {
    console.log('mediaitem', url)
    let urlLow = url.toLowerCase()
    let icon, text
    switch (true) {
      case (urlLow.includes('youtube.com') || urlLow.includes('youtu.be')):
        icon = <MediaIcon src={YOU_TUBE} />
        text = 'YouTube'
        break;
      case urlLow.includes('soundcloud.com'):
        icon = <MediaIcon src={SOUND_CLOUD} />
        text = 'SoundCloud'
        break;
      case urlLow.includes('beatport.com'):
        icon = <MediaIcon src={BEAT_PORT} />
        text = 'BeatPort'
        break;
      default:
    }
    let hasHttp = url.includes('http://') || url.includes('https://')
    let correctUrl = hasHttp ? url : ('http://' + url)
    return (
      <MediaRow>
        {icon}
        <MediaText target='_blank' href={correctUrl}>{text}</MediaText>
      </MediaRow>
    )
  }
    export const MissingMentorData = styled.span`
      cursor: pointer;
      display: ${props => props.hide ? 'none' : 'inline'}
    `
    export const Reviews = styled.div`

    `
  export const Label = styled.label`
    display: ${({hide}) => hide ? 'none' : 'flex'};
    font-size: 15px;
    font-weight: 500;
    color: #555555;
    margin: 25px 0 10px 0;
  `
  export const ReviewLabel = styled(Label)`
    font-size: 18px;
  `

  export const EditCol = styled(Col)`
    flex: 1;
    padding: 80px;
  `

  export const EditView = styled(View)`
    ${'' /* margin: 5% 10%; */}
    width: 80%;
    margin-top: 120px;
  `

  export const EditWorkText = styled.span`
    font-size: 20px;
    color: #555555;
    letter-spacing: 0;
    margin-bottom: 20px;
  `
