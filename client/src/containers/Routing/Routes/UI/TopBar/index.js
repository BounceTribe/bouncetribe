import React from 'react'
import {btBlack, btWhite} from 'styling/T'

import TopBarMenu from './TopBarMenu'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import styled from 'styled-components'

const TopBarContainer = styled.div`
  max-width: 100%;
  height: 25px;
  background-color: ${btBlack};
  padding-left: 15%;
  padding-right: 15%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 10px;
  color: ${btWhite};
`



const TopBar = (props) => {
  return (
    <TopBarContainer>
      <TopBarMenuItem
        to={'/'}
      >
        <span><b>BOUNCE</b>TRIBE</span>
      </TopBarMenuItem>

      <TopBarMenu
        isLoggedIn={props.isLoggedIn}
        router={props.router}
      />
    </TopBarContainer>
  )
}

export default TopBar
