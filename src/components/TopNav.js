import React from 'react'
import {Bar, Logo, NavList, NavLink} from 'styled/TopNav'
import {IconTextContainer, IconText} from 'styled'

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
          <IconTextContainer>

            <IconText>
              Tribe
            </IconText>
          </IconTextContainer>
        </NavLink>
        <NavLink
          to={`/${handle}/projects`}
        >
          <IconTextContainer>

            <IconText>
              Projects
            </IconText>
          </IconTextContainer>
        </NavLink>
        <NavLink
          to={`/${handle}`}
        >
          <IconTextContainer>

            <IconText>
              Profile
            </IconText>
          </IconTextContainer>
        </NavLink>
      </NavList>

    </Bar>
  )
}

export default TopNav
