import styled from 'styled-components'
import React from 'react'
import {View} from 'styled'
import AddButton from 'icons/AddButton'
import {grey500, grey400} from 'theme'

export const FindEmail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
  padding: 30px 0;
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
export const InviteContainer = ({onClick}) => (
  <InviteMember onClick={onClick}>
    <span>Invite Member</span>
    <AddButton/>
  </InviteMember>
)
