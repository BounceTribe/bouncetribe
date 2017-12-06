import React from 'react'
import styled from 'styled-components'
import {grey600, purple} from 'theme'
import {BtAvatar, BtTextMarker} from 'styled'
import {InviteButton} from 'styled/Dashboard'
import Collapse from 'material-ui-icons/KeyboardArrowUp'
import Expand from 'material-ui-icons/KeyboardArrowDown'

const FriendRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  box-sizing: border-box;
`
const Handle = styled.span`
  flex: 1;
  padding: 0 16px;
  font-size: 15px;
  color: ${props => props.selected ? purple : grey600};
  font-weight: ${props => props.selected ? 500 : 400};
  cursor: pointer;
  &:hover{color: ${purple}}
`

const Header = styled.span`
  padding: 0 16px;
  font-weight: 500;
  font-size: 14px;
  color: ${purple};
`

const makeRows = (users, select, selected) => (
  users.map( user =>
    <FriendRow key={user.id} onClick={()=>select(user.handle)}>
      <BtAvatar size={40} user={user} />
      <Handle selected={selected && user.id===selected.id}>{user.handle}</Handle>
      <BtTextMarker size={20} fontHeight={14} value={0}/>
    </FriendRow>
  )
)

export const FriendList = (props) => {
  let { friends,
        mentors,
        inviteTribe,
        inviteMentors,
        showTribe,
        showMentors,
        flipTribe,
        flipMentors,
        select,
        selected} = props

  const friendNodes = ((friends || {}).edges || []).map(edge=>edge.node)
  const mentorNodes = ((mentors || {}).edges || []).map(edge=>edge.node)

  const friendList = showTribe ? makeRows(friendNodes, select, selected) : []
  friendList.push(
    <FriendRow key={'inviteTribe'}>
      <InviteButton onClick={inviteTribe} rightText={'Add Tribe Member'}/>
    </FriendRow>
  )

  const mentorList = showMentors ? makeRows(mentorNodes, select, selected) : []
  mentorList.push(
    <FriendRow key={'addMentors'}>
      <InviteButton onClick={inviteMentors} rightText={'Add Mentor'}/>
    </FriendRow>
  )

  return (
    <div style={{overflowY: 'scroll', overflowX: 'hidden', width: '100%'}}>
      <FriendRow onClick={flipMentors} key={'My Mentors'}>
        <Header>{'My Mentors'}</Header>
        {showMentors ? <Collapse style={{paddingRight: '9px'}} color={grey600}/>
         : <Expand style={{paddingRight: '9px'}} color={grey600}/>}
      </FriendRow>
      {mentorList}

      <FriendRow onClick={flipTribe} key={'Tribe Members'}>
        <Header>{'Tribe Members'}</Header>
        {showTribe ? <Collapse style={{paddingRight: '9px'}} color={grey600}/>
         : <Expand style={{paddingRight: '9px'}} color={grey600}/>}
      </FriendRow>
      {friendList}

    </div>
  )
}
