import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import {rootSaga} from '../actions/saga'
import reducers from '../reducers'
import INITIAL_STATE from './INITIAL_STATE'


const sagaMiddleware = createSagaMiddleware()

const enhancer = composeWithDevTools(
  applyMiddleware(sagaMiddleware),
)

const configureStore = () => {

  const configuration = createStore(reducers, INITIAL_STATE, enhancer)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      configuration.replaceReducer(nextRootReducer)
    })
  }

  return configuration
}

const store = configureStore()

sagaMiddleware.run(rootSaga)



export default store
