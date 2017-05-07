import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey200, grey300, grey700, grey800, purple} from 'theme'

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
  border: 1px solid ${grey300};
  border-radius: 10px;
  padding-bottom: 10px;
  overflow: hidden;
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
`

export const ProjectArtThumb = styled(CreatorPortrait)`
  border-radius: 0;
`

export const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  justify-content: center;
  height: 55px;
`

export const ThumbLink = styled(BtLink)`
  display: flex;
  height: 55px;
  width: 55px;
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

export const Appreciate = styled.div`
  height: 100px;
  width: 100px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({appreciated}) => (appreciated) ? purple : grey700};
  cursor: pointer;
`

export const AppreciateText = styled.div`
  margin-top: 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${({appreciated}) => (appreciated) ? purple : grey700};
`

export const MessageContainer = styled.div`
  display: flex;
  border: 1px solid ${grey200};
  border-radius: 5px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 85%;
`

export const Messages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid ${grey200};
  width: 100%;
`

export const MessageNamePortraitRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 15px;
  margin-top: 10px;
  margin-left: 25px;
`

export const SenderHandle = styled.h4`
  display: flex;
  margin: 0;
  padding: 0;
  margin-left: 5px;
  color: ${({isPurple})=> (isPurple) ? purple: grey700};
`

export const MessageText = styled.p`
  display: flex;
  color: ${grey700};
  margin: 0px 95px 20px 95px;
  line-height: 14px;
`

export const MessagePortrait = styled(CreatorPortrait)`
  height: 50px;
  width: 50px;
  border-radius: 50px;
`

export const MessageDivider = styled.hr`
  width: 100%;
  background-color: ${grey200};
  height: 1px;
  border: 0;
`
