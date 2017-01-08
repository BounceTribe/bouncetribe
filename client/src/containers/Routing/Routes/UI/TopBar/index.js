import React from 'react'
import {btBlack, btWhite} from 'styling/T'

import TopBarMenu from './TopBarMenu'
import TopBarMenuItem from 'reusables/TopBarMenuItem'
import styled from 'styled-components'

const TopBarContainer = styled.div`
  max-width: 100%;
  height: 50px;
  background-color: ${btBlack};
  padding-left: 15%;
  padding-right: 15%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  color: ${btWhite};
`

const Bounce = styled.span`
  font-size: 15px;
  font-weight: 400;
`

const Tribe = styled.span`
  font-size: 15px;
  font-weight: 300;
  margin-left: .5px;
`

const TopBar = (props) => {
  return (
    <TopBarContainer>
      <TopBarMenuItem
        to={'/'}
      >
        <Bounce>BOUNCE</Bounce>
        <Tribe>TRIBE</Tribe>
      </TopBarMenuItem>

      <TopBarMenu
        isLoggedIn={props.isLoggedIn}
        router={props.router}
        viewer={props.viewer}
      />
    </TopBarContainer>
  )
}

export default TopBar
