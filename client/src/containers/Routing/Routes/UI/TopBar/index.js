import React from 'react'
import S from 'styling/S'
import {btBlack} from 'styling/T'

import TopBarMenu from './TopBarMenu'

const topBarBase = {
  maxWidth: '100%',
  height: '40px',
  backgroundColor: btBlack,
  color: 'white',
  paddingLeft: '15%',
  paddingRight: '15%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline'
}

const topBarS = new S({
  base: topBarBase
})

const TopBar = () => {
  return (
    <header
      style={{
        ...topBarS.all
      }}
    >
      <h1>BounceTribe</h1>
      <TopBarMenu/>
    </header>
  )
}

export default TopBar
