import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import {btPurple} from 'styling/T'

const SpinBox = styled.div`
  display: flex;
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
  background-color: ${btPurple};
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


class Spinner extends Component {

  render() {
    return (
      <SpinBox>
        <Ball0/>
        <Ball1/>
        <Ball2/>
      </SpinBox>
    )
  }
}

export default Spinner
