import styled from 'styled-components'
import {BtLink} from 'styled'
import {grey200, grey300, grey500, grey600, grey700, grey800, purple} from 'theme'

export const MatchList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 40px;
  width: 100%;
`

export const MatchCard = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 30%;
  margin-left: 2%;
  margin-bottom: 40px;
  border: 1px solid ${grey300};
  border-radius: 5px;
  padding-bottom: 10px;
  overflow: hidden;
  transition: .5s all;
  &:hover {
    box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
    margin-top: -10px;
  }
`

export const CardArt = styled.img`
  display: flex;
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 10px;
  &:hover {
    opacity: .8;
  }
`
 export const CardArtWrapper = styled.div`
   display: flex;
   cursor: pointer;
   align-items: flex-start;
   position: relative;
 `
export const ButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  opacity: 0;
  animation: all .1s;
  &:hover {
    opacity: 1;
    background-color: rgba(255,255,255,.4);
  }

`

export const Round = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${purple};
  height: 80px;
  width: 80px;
  border-radius: 80px;
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
  font-weight: 400;
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
  color: ${grey700};
  font-weight: 400;
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
  margin-top: 60px;
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

export const NoProjectsCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export const NoProjectMsg = styled.h2`
  color: ${grey800};
  font-weight: 400;
  text-align: center;
  font-size: 36px;
`


export const NoProjectQuote = styled.h4`
  color: ${grey600};
  font-weight: 400;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  font-size: 24px;
`
export const NoProjectAuthor = styled.h4`
  color: ${grey500};
  font-weight: 400;
  text-align: center;
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 18px;
`

export const FeedbackImage = styled.img`
  opacity: .5;
  transition: all .2s;
  &:hover {
    opacity: ${({disabled, selected}) => (disabled && !selected) ? .5 : 1};
    transform: ${({disabled, selected}) => (disabled && !selected) ? 'scale(1)' : 'scale(1.3)' };
  }
  ${({disabled, selected}) => {
    if (selected) {
      return "opacity: 1;"
    } else if (disabled && !selected) {
      return "opacity: .5;"
    }
  }}
  cursor: ${({disabled, selected}) => {
    if (disabled) {
      return ''
    } else {
      return 'pointer'
    }
  }};
  transform: ${({selected}) => (selected) ? 'scale(1.3)' : 'scale(1)' };

`

export const HelpfulQuestion = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${grey500};
`
