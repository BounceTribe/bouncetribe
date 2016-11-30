import {combineReducers} from 'redux'
import { reducer as formReducer } from 'redux-form'

import auth from './auth'
import ui from './ui'

const reducers = combineReducers({
  auth,
  ui,
  form: formReducer
})

export default reducers
