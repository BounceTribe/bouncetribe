import React from 'react'
import styled from 'styled-components'
import {white, grey400, purple} from 'theme'
import Tribe from 'icons/Tribe'
import AddFriend from 'icons/AddFriend'
import {BtFlatButton} from 'styled'
import {mapNodes} from 'utils/mapNodes'


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
  let btn;
  //Will hit if button has been clicked
  //These are all 'disabled' buttons
  //Cannot change state until page reload
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
  if (btn) return btn

  let {user, User} = props.viewer
  let friends = mapNodes(user.friends, '.id')
  let inviters = mapNodes(user.invitations, '.actor.id')
  let requestees = mapNodes(user.sentRequests, '.recipient.id')

  if (friends.includes(User.id)) {
    //User is Tribe member
    return <RemoveFromTribe onClick={()=>props.unfriend()} />
  } else if (inviters.includes(User.id)) {
    //Waiting on self/user to accept
    let invite = user.invitations.edges.find(edge=>edge.node.actor.id === User.id)
    return <AcceptTribeRequest onClick={()=>{props.accept(invite.node.id)}} />
  } else if (requestees.includes(User.id)) {
    //Waiting for User to accept
    return <TribeRequestSent />
  } else {
    //No relationship
    return <AddToTribe onClick={()=>props.addToTribe()}/>
  }
}

export const TribeButton = (props) => {
  return (
    <FriendButtonCol>
      {/* Make sure User is not self */}
      {props.viewer.user.id!==props.viewer.User.id && buttonType(props)}
    </FriendButtonCol>
  )
}
