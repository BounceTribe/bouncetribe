import styled from 'styled-components'
import React from 'react'
import {View, BtLink} from 'styled'
import AddButton from 'icons/AddButton'
import {grey500} from 'theme'


export const ProfileView = styled(View)`
  background-color: transparent;
  border: none;
  padding: 60px;
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

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  ${'' /* justify-content: center; */}
  ${'' /* width: 30%; */}
  padding-left: 20px;
  background-color: white;
  border-radius: 5px;
`

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  ${'' /* width: 70%; */}
  padding-right: 50px;
  background-color: white;
  border-radius: 5px;
`


const InviteMember = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Helvetica Neue";
  font-size: 12pt;
  width: 140px;
  height: 40px;
  cursor: pointer;
  color: ${grey500};
`
export const InviteContainer = () => (
  <InviteMember>
    <span>Invite Member</span>
    <AddButton/>
  </InviteMember>
)
