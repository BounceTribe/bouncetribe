import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {fade} from 'material-ui/utils/colorManipulator'
import {purple, blue, white, grey800} from './colors'

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
  }
})
