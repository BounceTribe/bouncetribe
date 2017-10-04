import styled from 'styled-components'
import React from 'react'
import {View, BtFlatButton} from 'styled'
import {grey400, grey200, grey800, purple, white} from 'theme'

export const MyTribe = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-top: 40px;
`

export const ProfileView = styled(View)`
  background-color: transparent;
  border: none;
  padding: 60px;
`

export const TopPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  border: solid ${grey400} .5px;
  padding-top: 20px;
`

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
  padding-left: 20px;
  background-color: white;
`

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  padding-right: 50px;
  margin-left: 15px;
  background-color: white;
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
  width: 33%;
  border: solid ${grey400} .5px;
  border-radius: 10px;
  padding: 0 20px;
  margin-left: 15px;
  padding-bottom: 40px;
`

export const BotRight = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
  min-height: 50vh;
  width: 66%;
  border: solid ${grey400} .5px;
  border-radius: 10px;
  margin-right: 15px;
  padding-bottom: 40px;
`

export const Divider = styled.hr`
border: .5px solid ${grey200};
background-color: ${grey200};
height: .5px;
width: 100%;
`

