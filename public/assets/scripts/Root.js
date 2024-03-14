import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store';

// Actions
import { receiveLogin } from './actions/auth';

// Utils
import { isNode } from '#/utils';

// Get store from server
const initialState =  !isNode ? window.__INITIAL_STATE__ : {};

// Create store
const store = configureStore(initialState);

// Init Google Analytics
/* ReactGA.initialize(appConfig.analytics); */

// Maintain token
let token = !isNode && localStorage && localStorage.getItem('reda_uid_t');
let user = !isNode && localStorage && JSON.parse(localStorage.getItem('user'));
if (token !== null && user !== null) {
    store.dispatch(receiveLogin({token,user}));
}

export default props => (
  <Provider store={store}>  
		{props.children}
	</Provider>
)