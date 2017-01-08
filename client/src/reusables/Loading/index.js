import React, {Component} from 'react'
import styled from 'styled-components'
import Spinner from 'reusables/Spinner'

const Overlay = styled.div`
  position: fixed;
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

class Loading extends Component {

  render() {
    return (
      <Overlay>
        <Spinner/>
      </Overlay>
    )
  }
}

export default Loading
