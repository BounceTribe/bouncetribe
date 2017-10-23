import React from 'react'
import styled from 'styled-components'
import {white, grey400, purple} from 'theme'
import Tribe from 'icons/Tribe'
import AddFriend from 'icons/AddFriend'
import {BtFlatButton} from 'styled'

const FriendButtonCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`
const  style = {
  border: `1px solid ${grey400}`,
  borderRadius: '5px',
  width: '220px'
}
const TribeRequestSent = () => (
  <BtFlatButton
    label={'Tribe Request Sent'}
    backgroundColor={white}
    labelStyle={{ color:purple }}
    icon={ <Tribe fill={purple} height={16} /> }
    style={style}
    disabled
  />
)
const AddToTribe = ({onClick}) => (
  <BtFlatButton
    label={'Add to Tribe'}
    backgroundColor={purple}
    labelStyle={{ color: white }}
    icon={ <AddFriend fill={white} height={16} /> }
    onClick={onClick}
    style={style}
  />
)
const AddedToTribe = () => (
  <BtFlatButton
    label={'Added to Tribe'}
    backgroundColor={purple}
    labelStyle={{ color: white }}
    icon={ <AddFriend fill={white} height={16} /> }
    style={style}
    disabled
  />
)
const AcceptTribeRequest = ({onClick}) => (
  <BtFlatButton
    label={'Accept Tribe Request'}
    backgroundColor={white}
    labelStyle={{ color:purple }}
    icon={ <Tribe fill={purple} height={16} /> }
    style={style}
    onClick={onClick}
  />
)
const RemovedFromTribe = () => (
  <BtFlatButton
    label={'Removed from Tribe'}
    backgroundColor={white}
    labelStyle={{ color:purple }}
    icon={ <Tribe fill={purple} height={16} /> }
    style={style}
    disabled
  />
)
const RemoveFromTribe = ({onClick}) => (
  <BtFlatButton
    label={'Remove from Tribe'}
    backgroundColor={purple}
    labelStyle={{ color: white }}
    icon={ <AddFriend fill={white} height={16} /> }
    onClick={onClick}
    style={style}
  />
)
const buttonType = (props) => {
  console.log('btnType props', props);
  let btn;
  switch (props.btnStatus) {
    case 'REMOVED':
      btn = <RemovedFromTribe />
      break
    case 'ACCEPTED':
      btn = <AddedToTribe />
      break
    case 'SENT':
      btn = <TribeRequestSent />
      break
    default:
      btn = null;
  }
  if (btn) {
    return btn
  }

  let {user, User} = props.viewer
  let friends = user.friends.edges.map(edge => edge.node.id)
  let inviters = user.invitations.edges.map(edge => edge.node.actor.id)
  let requestees = user.sentRequests.edges.map(edge => edge.node.recipient.id)
  console.log('btnType props', friends, inviters, requestees, User.id);

  if (friends.includes(User.id)) {
    return <RemoveFromTribe onClick={()=>props.unfriend()} />
  } else if (inviters.includes(User.id)) {
    let invite = user.invitations.edges.find((edge)=>edge.node.actor.id === User.id)
    return <AcceptTribeRequest onClick={()=>{props.accept(invite.node.id)}}/>
  } else {
    return (<AddToTribe onClick={()=>props.addToTribe()}/>)
  }
}

export const TribeButton = (props) => {
  return (
    <FriendButtonCol>
      {props.viewer.user.id!==props.viewer.User.id && buttonType(props)}
    </FriendButtonCol>
  )
}
