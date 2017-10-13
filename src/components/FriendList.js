import React from 'react'
import styled from 'styled-components'
import {grey500, purple} from 'theme'
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
  padding: 10px 20px;
  box-sizing: border-box;
`
const Handle = styled.span`
  flex: 1;
  padding: 0 16px;
  font-weight: 400;
  font-size: 15px;
  color: ${props => props.active ? purple : grey500};
`

const Header = styled.span`
  padding: 0 16px;
  font-weight: 500;
  font-size: 14px;
  color: ${purple};
`
const makeRows = users => (
  users.map( user =>
    <FriendRow key={user.id}>
      <BtAvatar size={40} user={user} />
      <Handle active={user.isOnline}>{user.handle}</Handle>
      <BtTextMarker size={20} fontHeight={14} value={3}/>
    </FriendRow>
  )
)

export const FriendList = ({friends, category, invite, show, flip}) => {
  const users = friends.edges.map(edge=>edge.node)
  const list = makeRows(users);
  list.push(
    <FriendRow key={'invite'}>
      <InviteButton onClick={invite} />
    </FriendRow>
  )

  return (
    <div>
      <FriendRow key='heading'>
        <Header>{category}</Header>
        {show ? <Collapse onClick={flip}/> : <Expand onClick={flip}/>}
      </FriendRow>
      {show && list}
    </div>
  )
}
