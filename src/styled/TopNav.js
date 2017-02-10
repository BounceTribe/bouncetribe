import React from 'react'
import styled from 'styled-components'
import {BtLink} from 'styled'
import {white, grey40, grey70} from 'theme'

export const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10%;
  height: 50px;
  background-color: ${grey40};
  box-sizing: border-box;
`


export const NavList = styled.div`
  display: flex;
  align-items: center;
`

export const NavLink = styled(BtLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${white};
  padding: 0 15px;
  border-right: 1px solid ${grey70};
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
`

export const Title = styled(BtLink)`
  display: flex;
  color: ${white};
`
const Bold = styled.span`
  display: flex;
  font-weight: 400;
`

export const Logo = (props) =>{
  return (
    <Title
      {...props}
    >
      <Bold>BOUNCE</Bold>TRIBE
    </Title>
  )
}

export const NavImg = styled.img`
  display: flex;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  object-fit: cover;
`

export const ImgLink = styled(BtLink)`
  color: ${white};
  padding: 0 30px 0 15px;
`

export const Portrait = (props) => {
  return (
    <ImgLink
      {...props}
    >
      <NavImg
        {...props}
      />
    </ImgLink>
  )
}

export const NavText = styled.span`
  display: flex;
  margin-left: 4px;
`
