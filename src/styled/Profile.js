// import React, {Component} from 'react'
import styled from 'styled-components'
// import Edit from 'icons/Edit'
// import {purple} from 'theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 80px 100px;
  box-sizing: border-box;
`

export const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
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
  justify-content: stretch;
  width: 100%;
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 200px;
  background-color: red;
`

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 200px;
  background-color: green;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: pink;
  height: 200px;
  width: 100%;
`

export const Portrait = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 150px;
  object-fit: cover;
`


export const Input = styled.input`
  border: none;
  outline: none;
  font-weight: 200;
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
  margin-bottom: 10px;
`

export const Location = styled(Input)`
  font-size: 15px;
  margin-left: 10px;
  width: ${(props)=>inputWidth(props,8)}px;
`

export const InputRow = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const ScoreRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  height: 20px;
  margin-top: 20px;
`

export const Score = styled.span`
  font-size: 20px;
  margin-right: 50px;
  margin-left: 10px;
`
