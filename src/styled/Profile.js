import React, {Component} from 'react'
import styled from 'styled-components'
import {View, BtFlatButton} from 'styled'
// import Edit from 'icons/Edit'
import {grey400, grey200, grey800, purple, white} from 'theme'
import Tribe from 'icons/Tribe'

export const ProfileView = styled(View)`
  background-color: transparent;
  border: none;
  padding: 60px;
`

export const Divider = styled.hr`
  border: .5px solid ${grey200};
  background-color: ${grey200};
  height: .5px;
  width: 100%;
`
export const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  border: solid ${grey400} .5px;
  padding-top: 40px;
`

export const TopCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 30px;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width:100%;
  padding: 10px 100px;
  box-sizing: border-box;
`

export const SubRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  padding-left: 20px;
`



export const Portrait = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 150px;
  object-fit: cover;
  cursor: ${({ownProfile})=>(ownProfile) ? 'pointer' : '' };
`


export const Input = styled.input`
  border: none;
  outline: none;
  font-weight: 200;
  margin-left: 10px;
  margin-bottom: 10px;

`

const inputWidth = (props, multiplier) => {
  let {value, placeholder} = props
  let width = value.length * multiplier
  let placeholderWidth = placeholder.length * multiplier
  if (width < placeholderWidth) {
    return placeholderWidth
  } else {
    return width
  }
}

export const Handle = styled(Input)`
  font-size: 30px;
  width: ${(props)=>inputWidth(props,15)}px;
  margin-left: 0;
`

export const Location = styled(Input)`
  font-size: 15px;
  width: ${(props)=>inputWidth(props,8)}px;
`

export const InputRow = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const ExperienceRow = styled(InputRow)`
  margin-top: 5px;
  align-items: center;
`

export const ScoreRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  height: 20px;
  margin-top: 10px;
`

export const Score = styled.span`
  font-size: 20px;
  margin-right: 50px;
  margin-left: 10px;
`

export const Summary = styled.textarea`
  display: flex;
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  font-size: 14px;
  line-height: 20px;
  color: ${grey800};
  min-height: 100px;
  resize: none;
`

export const BotRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`

export const BotLeft = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
  min-height: 50vh;
  width: 66%;
  border: solid ${grey400} .5px;
  border-radius: 10px;
  margin-right: 15px;
`

export const BotRight = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
  min-height: 50vh;
  width: 33%;
  border: solid ${grey400} .5px;
  border-radius: 10px;
  padding: 0 20px;
  margin-left: 15px;
`

export const Label = styled.label`
  display: flex;
  font-size: 18px;
  font-weight: 400;
  margin-top: 40px
`

export const InputError = styled.span`
  display: flex;
  color: red;
  font-size: 12px;
`

export const FriendButtonCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const Experience = styled(Input)`
  font-size: 14px;
  width: ${(props)=>inputWidth(props,11)}px;
  margin-bottom: 0;
`

export class TribeButton extends Component {

  state = {
    remove: false
  }



  button = () => {
    let {user, User} = this.props.viewer
    let button = null
    if (user.id === User.id) {
      return button
    } else {
      let friends = user.friends.edges.map(edge => edge.node.id)
      let inviters = user.invitations.edges.map(edge => edge.node.actor.id)
      let requestees = user.sentRequests.edges.map(edge => edge.node.recipient.id)
      if (friends.includes(User.id)) {
        return (
          <BtFlatButton
            label={(this.state.remove) ? 'Remove' : 'Tribe Member'}
            backgroundColor={(this.state.remove) ? white : purple}
            labelStyle={{
              color: (this.state.remove) ? purple : white
            }}
            icon={
              <Tribe
                fill={(this.state.remove) ? purple : white}
              />
            }
            onClick={()=>{
              if (!this.state.remove) {
                this.setState({remove:true})
              } else {
                this.props.unfriend()
              }
            }}
            style={{
              border: `1px solid ${grey400}`,
              borderRadius: '5px',
              width: '160px'
            }}
          />
        )
      } else if (inviters.includes(User.id)) {
        let invite = user.invitations.edges.find((edge)=>{
          return edge.node.actor.id === User.id
        })
        return (
          <BtFlatButton
            label={'Accept'}
            backgroundColor={purple}
            labelStyle={{
              color:white
            }}
            icon={
              <Tribe
                fill={white}
              />
            }
            onClick={()=>{
              this.props.accept(invite.node.id)
            }}
            style={{
              border: `1px solid ${grey400}`,
              borderRadius: '5px',
              width: '160px'
            }}
          />
        )
      } else if (requestees.includes(User.id)) {
        return (
          <BtFlatButton
            label={'Invite Sent'}
            backgroundColor={white}
            labelStyle={{
              color:purple
            }}
            icon={
              <Tribe
                fill={purple}
              />
            }
            onClick={()=>{

            }}
            style={{
              border: `1px solid ${grey400}`,
              borderRadius: '5px',
              width: '160px'
            }}
            disabled={true}
          />
        )
      } else {
        return (
          <BtFlatButton
            label={'Add to Tribe'}
            backgroundColor={purple}
            labelStyle={{
              color: white
            }}
            icon={
              <Tribe
                fill={white}
              />
            }
            onClick={()=>{
              this.props.addToTribe()
            }}
            style={{
              border: `1px solid ${grey400}`,
              borderRadius: '5px',
              width: '160px'
            }}
          />
        )
      }
    }
  }

  render () {
    return (
      <FriendButtonCol>
        {this.button()}
      </FriendButtonCol>
    )
  }
}
