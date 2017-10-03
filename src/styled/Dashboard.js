import styled from 'styled-components'
import React from 'react'
import {View, BtFlatButton} from 'styled'

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
border: solid black .5px;
padding-top: 40px;
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
  background-color: white;
`

