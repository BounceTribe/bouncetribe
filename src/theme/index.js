import {css} from 'styled-components'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {deepPurple300, grey50, grey100, grey200, grey300, grey400, grey500, grey600, grey700, grey800, grey900, white, black} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'



export const fbBlue = 'rgb(68,100,162)'

export const size = {
  m: (...args) => css`
    @media (max-width: 800px) {
      ${ css(...args) }
    }
  `
}

const purple = deepPurple300

export const btTheme = getMuiTheme({
  fontFamily: 'Helvetica, san-serif',
  palette: {
    primary1Color: purple,
  },
  tabs: {
    backgroundColor: white,
    textColor: fade(grey800, 0.7),
    selectedTextColor: grey800,
  },
  floatingActionButton: {
    buttonSize: 75
  }
})

export const transparent = `rgba(0,0,0,0)`

export const teal = 'rgb(23, 207, 170)'
export const grey40 = 'rgb(40,40,40)'
export const grey70 = 'rgb(70,70,70)'
export const grey150 = 'rgb(150,150,150)'
export const grey215 = 'rgb(215,215,215)'
export const grey230 = 'rgb(230,230,230)'
export const grey250 = 'rgb(250,250,250)'

export {purple, grey50, grey100, grey200, grey300, grey400, grey500, grey600, grey700, grey800, grey900, white, black}
