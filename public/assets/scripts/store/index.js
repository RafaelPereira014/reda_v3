import thunkMiddleware  from 'redux-thunk';
import apiMiddleware  from '#/middleware/api';
import multi from 'redux-multi';

import reducers from '#/reducers/index';
import { createStore, applyMiddleware } from 'redux';


export default function configureStore(initialState) {
  const store = applyMiddleware(
    multi,
    thunkMiddleware,
    apiMiddleware
  )(createStore)(reducers, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}