import { Action, combineReducers, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import * as freeze from 'redux-freeze';
import { accountReducer } from './account.reducer';
const thunkMiddleware = require('redux-thunk');

const loggerMiddleware = createLogger({
  timestamp: false,
  collapsed: true,
});

const rootReducer = combineReducers({
  accounts: accountReducer
});

const middleware = [
  thunkMiddleware.default
];

if (process.env.NODE_ENV === 'development') {
  middleware.push(freeze);
  middleware.push(loggerMiddleware);
}

const store = createStore(
  rootReducer,
  applyMiddleware(
    ...middleware
  )
);
export default store;