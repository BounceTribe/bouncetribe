import styled from 'styled-components'
// import React from 'react'
import {View, BtLink} from 'styled'

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

export const AddMemberTop = styled(BtLink)`
  display: flex;
  text-decoration: none;
  cursor: pointer;
`
