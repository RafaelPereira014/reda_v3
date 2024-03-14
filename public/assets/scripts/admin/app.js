'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware  from 'redux-thunk';
import apiMiddleware  from '#/middleware/api';
import multi from 'redux-multi';
import reducers from '#/reducers';
import CustomRoutes from '%/routes';

// Actions
import { receiveLogin } from '#/actions/auth';

// Utils
import { isNode } from '#/utils';

// Get store from server
const initialState =  !isNode ? window.__INITIAL_STATE__ : {};

// Create store
const store = applyMiddleware(
  multi,
  thunkMiddleware,
  apiMiddleware
)(createStore)(reducers, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


// Maintain token
let token = !isNode && localStorage && localStorage.getItem('reda_uid_t');
let user = !isNode && localStorage && JSON.parse(localStorage.getItem('user'));
if (token !== null && user !== null) {
    store.dispatch(receiveLogin({user}));
}

if(isNode){
	ReactDOM.hydrate(
	<Provider store={store}>  
		<CustomRoutes />
	</Provider>
	, document.getElementById('site-canvas'));
}else{
	ReactDOM.render(
	<Provider store={store}>  
		<CustomRoutes />
	</Provider>
	, document.getElementById('site-canvas'));
}

