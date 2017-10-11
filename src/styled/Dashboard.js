import styled from 'styled-components'
import React, {Component} from 'react'
import {View} from 'styled'
import InviteIcon from 'icons/InviteIcon'
import Send from 'icons/Send'
import {white, grey500, grey400, purple} from 'theme'
import {BtFlatButton} from 'styled'
import {SmallPic, Name} from 'styled/Tribe'
import {SubRow} from 'styled/Profile'
import AddFriend from 'icons/AddFriend'
import FlatButton from 'material-ui/FlatButton'
import {url} from 'config'

export const DialogRow = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 25px 0;
  border-bottom: 0.5px solid ${grey400};

`
const FbDialogRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
`
export const SendInviteBtn = ({onClick}) => (
  <FlatButton
    label={'Send Invite'}
    backgroundColor={purple}
    labelStyle={{
      color: `${white}`,
      fontSize: '14px',
      fontFamily: 'Helvetica Neue',
      textTransform: 'none'
    }}
    icon={
      <Send fill={white} height={14}
        style={{vertialAlign: 'middle', lineHeight: '41px'}}
      /> }
    onClick={onClick}
    style={{
      border: `1px solid ${grey400}`,
      borderRadius: '5px',
      width: '223px',
      height: '41px',
      marginTop: '18px'
    }}
  />
)




// styled(FlatButton)`
//   border: 1px solid ${grey400};
//   border-radius: 5px;
//   width: 60px;
//   height: 4 0px;
//   background-color: ${white};
// `
export const DialogSpacer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-left: 27px;
  box-sizing: border-box;
`
export const TopCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 30px;
`
export const DialogRow2 = styled(DialogRow)`
  justify-content: space-between;
`

export const DashLeft = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
  min-height: 50vh;
  width: 25%;
  border: solid ${grey400} .5px;
  border-radius: 10px;
  margin-right: 15px;
  padding-bottom: 40px;
`

export const DashRight = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
  min-height: 50vh;
  width: 75%;
  border: solid ${grey400} .5px;
  border-radius: 10px;
  padding: 0 20px;
  margin-left: 15px;
  padding-bottom: 40px;
`

export const ProfileView = styled(View)`
  background-color: transparent;
  border: none;
  padding: 60px;
  justify-content: flex-start;
`

export const TopPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: white;
  border-radius: 5px;
  border: solid black .5px;
  padding-top: 40px;
`

const InviteStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Helvetica Neue";
  font-size: 12pt;
  height: 40px;
  cursor: pointer;
  color: ${grey500};
`

const Span7pxRight = styled.span`
  margin-right: 7px;
`
export const InviteButton = ({onClick, text}) => (
  <InviteStyled onClick={onClick}>
    {text && <Span7pxRight>{text}</Span7pxRight>}
    <InviteIcon/>
  </InviteStyled>
)

export class FbList extends Component {
  state = { invited: false, }
  render () {
    let {friend, createFriendRequest} = this.props
    let {invited} = this.state
    return (
      <FbDialogRow user={friend} >
        <SubRow>
          <SmallPic
            src={friend.portrait ? friend.portrait.url : `${url}/logo.png`}
            to={`/${friend.handle}`} />
          <Name style={{lineHeight:'55px'}} to={`/${friend.handle}`}>
            {friend.handle}
          </Name>
        </SubRow>
        <BtFlatButton
          onClick={()=>{
            this.setState({ invited: true, })
            createFriendRequest()
          }}
          backgroundColor={white}
          labelStyle={{ color: `${white}` }}
          icon={ <AddFriend fill={(invited) ? white : purple} height={16} /> }
          style={{
            border: `1px solid ${grey400}`,
            borderRadius: '5px',
            width: '60px',
            height: '4 0px'
          }}
          disabled={invited}
        />
      </FbDialogRow>
    )
}
}
