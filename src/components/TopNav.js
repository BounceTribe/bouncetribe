import React from 'react'
import {Bar, Logo, NavList, NavLink, Portrait, NavText} from 'styled/TopNav'
import {BtFlatButton} from 'styled'
import {white, purple} from 'theme'
import Plus from 'icons/Plus'
import Music from 'icons/Music'
import Headphones from 'icons/Headphones'

const TopNav = ({handle, portraitUrl}) => {

  return (
    <Bar>
        <Logo
          to={'/'}
        />
      <NavList>
        <NavLink
          to={`/${handle}/tribe`}
        >

            <NavText>
              Tribe
            </NavText>
        </NavLink>
        <NavLink
          to={`/${handle}/sessions`}
        >
          <Headphones/>
          <NavText>
            Sessions
          </NavText>
        </NavLink>
        <NavLink
          to={`/${handle}/projects`}
        >
          <Music
            height={18}
          />
          <NavText>
            Projects
          </NavText>
        </NavLink>

        <Portrait
          src={portraitUrl}
          to={`/${handle}`}
        />

        <BtFlatButton
          label={'New Project'}
          labelStyle={{
            color: white,
            fontSize: '13px',
            fontWeight: '400'
          }}
          backgroundColor={purple}
          to={`/${handle}/projects/new`}
          icon={<Plus/>}
          style={{borderRadius: '8px'}}
        />

      </NavList>

    </Bar>
  )
}

export default TopNav
