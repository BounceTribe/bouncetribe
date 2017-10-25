import React from 'react'
import styled, {keyframes} from 'styled-components'
import {purple} from 'theme'

const SpinBox = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
`

const Bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1.0);
  }
`

const Ball2 = styled.div`
  width: 18px;
  height: 18px;
  background-color: ${purple};
  border-radius: 100%;
  display: inline-block;
  animation: ${Bounce} 1.4s infinite ease-in-out both;
`

const Ball0 = styled(Ball2)`
  animation-delay: -0.32s;
`

const Ball1 = styled(Ball2)`
  animation-delay: -0.16s;
`


export const Spinner = (props) => {
  return (
    <SpinBox
      {...props}
    >
      <Ball0/>
      <Ball1/>
      <Ball2/>
    </SpinBox>
  )
}

const Overlay = styled.div`
  position: ${props => props.nested ? 'relative' : 'fixed'}
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(220,220,220,.2);
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
`

export const Loading = ({nested}) => {
  return (
    <Overlay nested={nested}>
      <Spinner/>
    </Overlay>
  )
}
