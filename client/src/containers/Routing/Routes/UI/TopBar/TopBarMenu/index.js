import React from 'react'
import S from 'styling/S'
import TopBarMenuItem from './TopBarMenuItem'
import AuthContainer from 'reusables/AuthContainer'

const topBarMenuBase = {
  display: 'flex'
}

const topBarMenu = new S({
  base: topBarMenuBase
})

const TopBarMenu = () => {
  return (
      <menu
        style={{
          ...topBarMenu.all
        }}
      >
        <TopBarMenuItem
          text={'Projects'}
        />
        <TopBarMenuItem
          text={'Notifications'}
        />
        <TopBarMenuItem
          text={'My Account'}
          dropDown={
            <AuthContainer/>
          }
        />
      </menu>
  )
}

export default TopBarMenu
