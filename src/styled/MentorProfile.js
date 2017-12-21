import React from 'react'
import styled from 'styled-components'
import {View} from 'styled'
import {white, purple} from 'theme'
import {Link} from 'react-router'
import YOU_TUBE from 'icons/YOU_TUBE.png'
import SOUND_CLOUD from 'icons/SOUND_CLOUD.png'

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  min-height: 40vh;
  border: solid #E3E3E3 1px;
  border-radius: 10px;
  margin-bottom: auto;
  ${'' /* padding: 10px; */}
  width: 325px;
  object-fit: cover;

  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
`

export const MentorView = styled(View)`
  flex-direction: row;
  background-color: transparent;
  border: none;
  box-shadow: none;
  width: 80%;
  padding: 20px 0;
`
export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`
export const UpperMain = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  border: 1px solid #E3E3E3;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);

`
  export const CenteredRow = styled.div`
    display: flex;
    flex-direction: column;
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
  export const Location = styled.div`
    display: flex;
    font-weight: 300;
    font-size: 14px;
    margin: 10px 0px 10px 0px;
    color: #777777;
    letter-spacing: 0.3px;
  `
  export const Rating = styled.div`
    display: flex;
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

export const InfoFeed = styled.div`
  display: flex;
  flex-direction: column;
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
  export const MediaLinks = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 13px;
    color: #9075F3;
  `
  const MediaIcon = styled.img`
    width: 50px;
    object-fit: cover;
  `
  const MediaText = styled(Link)`
    font-weight: 500;
    font-size: 13px;
    color: ${purple};
    letter-spacing: 0;
    text-decoration: none;
    padding-left: 15px;
  `
  const MediaRow = styled.div`
    display: flex;
  `
  export const MediaItem = ({type, url}) =>{
    console.log('mediaitem', type, url);
    return <MediaRow>
      <MediaIcon src={`icons/${type}.png`} />
      <MediaText to={url}>{type}</MediaText>
    </MediaRow>
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
