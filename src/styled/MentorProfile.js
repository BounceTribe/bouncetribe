import React from 'react'
import styled from 'styled-components'
import {View} from 'styled'
import {white, purple} from 'theme'
import {Link} from 'react-router'


export const MentorView = styled(View)`
  flex-direction: row;
`
export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const UpperMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 18px 30px;
`
  export const CenteredRow = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 18px 30px;
  `
  export const MentorHandle = styled.div`
    font-weight: 500;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
  `
  export const Location = styled.span`
    font-size: 14px;
    margin: 12px 0px 20px 0px;
    color: #777777;
    letter-spacing: 0.3px;
  `
  export const Rating = styled.div`

  `
    export const RatingVal = styled.div`
      font-size: 15px;
      color: #555555;
      letter-spacing: 0;
    `
    export const NumberRatings = styled.div`
      font-size: 15px;
      color: #999999;
      letter-spacing: 0;
    `

  export const Summary = styled.pre`
    font-size: 14px;
    line-height: 20px;
    padding: 20px;
    border-radius: 10px;
    border-top: 1px solid #E3E3E3;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: #777777;
    word-break: break-all;
    white-space: pre-wrap;
  `

export const InfoFeed = styled.div`
  display: flex;
  flex-direction: column;
  padding: 35px 40px;
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
  export const MediaItem = ({type, url}) =>
    <MediaRow>
      <MediaIcon src={`icons/${type}.png`} />
      <MediaText to={url}>{type}</MediaText>
    </MediaRow>

    export const MissingMentorData = styled.span`
      cursor: pointer;
      display: ${props => props.hide ? 'none' : 'inline'}
    `


export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  min-height: 40vh;
  ${'' /* max-height: 60vh; */}
  width: 25%;
  border: solid #E3E3E3 1px;
  border-radius: 5px;
  padding: 20px 20px 20px 25px;
  margin-left: 15px;
  padding-bottom: 40px;
  margin-bottom: auto;
  ${'' /* overflow: scroll; */}
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
`
  export const Label = styled.label`
    display: ${({hide}) => hide ? 'none' : 'flex'};
    font-size: 15px;
    font-weight: 500;
    color: #555555;
    margin-bottom: 5px;
  `
