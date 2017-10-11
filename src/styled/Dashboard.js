import styled from 'styled-components'
import React from 'react'
import {View} from 'styled'
import AddButton from 'icons/AddButton'
import { grey500, grey400} from 'theme'

export const DialogRow = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 25px 0;
  border-bottom: 0.5px solid ${grey400};
`
export const FbDialogRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
`
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
