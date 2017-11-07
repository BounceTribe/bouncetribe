import {css} from 'styled-components'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {deepPurple300, grey50, grey100, grey200, grey300, grey400, grey500, grey600, grey700, grey800, grey900, white, black, lightBlue500} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'



export const fbBlue = '#4464A2'

export const size = {
  m: (...args) => css`
    @media (max-width: 800px) {
      ${ css(...args) }
    }
  `
}

const purple = '#9075F3'
export const blue = lightBlue500

export const transparent = `rgba(0,0,0,0)`

export const teal = '#17CFAA'
export const grey40 = '#282828'
export const grey70 = '#464646'
export const grey150 = '#969696'
export const grey119 = '#777777'
export const grey215 = '#D7D7D7'
export const grey222 = '#DEDEDE'
export const grey230 = '#E6E6E6'
export const grey250 = '#FAFAFA'



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
    buttonSize: 60,
    secondaryColor: blue,
    miniSize: 40
  },
  appBar: {
    color: white,
    textColor: black
  }
})

export const bigTheme = getMuiTheme({
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
    buttonSize: 80,
    secondaryColor: blue,
    miniSize: 40
  }
})


export {purple, grey50, grey100, grey200, grey300, grey400, grey500, grey600, grey700, grey800, grey900, white, black}
