import {combineReducers} from 'redux'
import { reducer as formReducer } from 'redux-form'

import auth from './auth'

const reducers = combineReducers({
  auth,
  form: formReducer
})

export default reducers
