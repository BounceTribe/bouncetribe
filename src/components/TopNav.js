import React, {Component} from 'react'
import {Bar, Logo, NavList, NavLink, Portrait, NavText} from 'styled/TopNav'
import {BtFlatButton} from 'styled'
import {white, purple} from 'theme'
import Plus from 'icons/Plus'
import Music from 'icons/Music'
import Headphones from 'icons/Headphones'
import Alerts from 'icons/Alerts'
import {Dropdown, DropdownMenuItem} from 'components/Dropdown'
import auth from 'utils/auth'

class TopNav extends Component {

  state = {
    dropdownOpen: false
  }


  render() {
    let {handle, portraitUrl} = this.props
    return (
      <Bar>
          <Logo
            to={'/'}
          />
        <NavList>
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
          <NavLink>
            <Alerts
              alerts={false}
            />
          </NavLink>
          <Portrait
            src={portraitUrl}
            to={`/${handle}`}
            onMouseOver={()=>{
              this.setState((prevState) => {
                if (!prevState.dropdownOpen){
                  return {
                    dropdownOpen: true
                  }
                }
              })
            }}
          />
          <Dropdown
            hide={(!this.state.dropdownOpen)}
            close={()=>{
              console.log("mouseleave")
              this.setState((prevState) => {
                if (prevState.dropdownOpen){
                  return {
                    dropdownOpen: false
                  }
                }
              })
            }}
          >
            <DropdownMenuItem
              text="Help"
            />
            <DropdownMenuItem
              text="Logout"
              onClick={auth.logout}
            />
          </Dropdown>

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
}

export default TopNav
