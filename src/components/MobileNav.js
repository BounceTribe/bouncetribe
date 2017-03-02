import React, {Component} from 'react'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
// import {white, purple} from 'theme'
// import Plus from 'icons/Plus'
import Music from 'icons/Music'
// import Headphones from 'icons/Headphones'
import {BotNav} from 'styled'

class MobileNav extends Component {

  state = {
    selectedIndex: 0,
  }

  select = (index) => this.setState({selectedIndex: index})

  render() {
    return (
        <BotNav>
          <BottomNavigation
            selectedIndex={this.state.selectedIndex}
          >
            <BottomNavigationItem
              label="Projects"
              icon={<Music/>}
              onTouchTap={() => this.select(0)}
            />
          </BottomNavigation>
        </BotNav>
    )
  }
}

export default MobileNav
