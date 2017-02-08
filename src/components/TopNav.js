import React from 'react'
import {Bar, Logo, NavList, NavLink} from 'styled/TopNav'
import {IconText} from 'styled'

const TopNav = ({handle}) => {

  return (
    <Bar>
      <NavLink
        to={`/`}
      >
        <Logo>
          BOUNCETRIBE
        </Logo>
      </NavLink>
      <NavList>
        <NavLink
          to={`/${handle}/tribe`}
        >

            <IconText>
              Tribe
            </IconText>
        </NavLink>
        <NavLink
          to={`/${handle}/projects`}
        >

            <IconText>
              Projects
            </IconText>
        </NavLink>
        <NavLink
          to={`/${handle}`}
        >

            <IconText>
              Profile
            </IconText>
        </NavLink>
      </NavList>

    </Bar>
  )
}

export default TopNav
