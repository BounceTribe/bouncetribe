import React from 'react'
import S from 'styling/S'
import {btBlack} from 'styling/T'

import TopBarMenu from './TopBarMenu'
import TopBarMenuItem from './TopBarMenu/TopBarMenuItem'

const topBarBase = {
  maxWidth: '100%',
  height: '25px',
  backgroundColor: btBlack,
  color: 'white',
  paddingLeft: '15%',
  paddingRight: '15%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  paddingTop: '10px'
}

const topBarS = new S({
  base: topBarBase
})

const TopBar = (props) => {
  return (
    <header
      style={{
        ...topBarS.all
      }}
    >
      <TopBarMenuItem
        to={'/'}
      >
        <span><b>BOUNCE</b>TRIBE</span>
      </TopBarMenuItem>

      <TopBarMenu
        isLoggedIn={props.isLoggedIn}
        router={props.router}
        viewer={props.viewer}
      />
    </header>
  )
}

export default TopBar
