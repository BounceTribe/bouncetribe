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
  border: ${props => props.selected ? `0.5px solid ${purple}` : 'none'};
`
const Handle = styled.span`
  flex: 1;
  padding: 0 16px;
  font-weight: 400;
  font-size: 15px;
  color: ${props => props.active ? purple : grey600};
`

const Header = styled.span`
  padding: 0 16px;
  font-weight: 500;
  font-size: 14px;
  color: ${purple};
`

const makeRows = (users, select, selected) => (
  users.map( user =>
    <FriendRow selected={user.id===selected.id} key={user.id} onClick={()=>select(user)}>
      <BtAvatar size={40} user={user} />
      <Handle active={user.isOnline}>{user.handle}</Handle>
      <BtTextMarker size={20} fontHeight={14} value={3}/>
    </FriendRow>
  )
)

export const FriendList = (props) => {
  let {friends, category, invite, show, flip, select, selected} = props;
  const users = friends.edges.map(edge=>edge.node)
  const list = show ? makeRows(users, select, selected) : [];
  list.push(
    <FriendRow key={'invite'}>
      <InviteButton onClick={invite} />
    </FriendRow>
  )

  return (
    <div>
      <FriendRow key='heading'>
        <Header>{category}</Header>
        {show ?
           <Collapse color={grey600} onClick={flip}/> :
           <Expand color={grey600} onClick={flip}/>}
      </FriendRow>
      {list}
    </div>
  )
}
