import React from 'react'
import styled from 'styled-components'
import {white, grey230, purple} from 'theme'
import {Link} from 'react-router'

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const View = styled.section`
  background-color: ${white};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: 50px;
  border: solid ${grey230} .5px;
`
export const FeedView = styled(View)`
  width: 65%;
`

export const IconTextContainer = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
`
export const IconText = styled.span`
  margin-left: 3px;
`
export const BtButton = styled.button`
  background-color: ${purple};
  color: ${white};
  border: none;
  outline: none;
`

export const ButtonLink = styled(Link)`
  color: none;
  text-decoration: none;
`

export const Button = ({to, children}) => {
  return (
    <ButtonLink
      to={to}
    >
      <BtButton>
        {children}
      </BtButton>
    </ButtonLink>
  )
}
