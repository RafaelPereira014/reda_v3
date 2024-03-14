'use strict';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

import { isNode } from '#/utils';

import { 
	CONFIG_REQUEST, 
	CONFIG_SUCCESS,
	CONFIG_FAILURE
} from './action-types';
const BASE_URL = isNode ? 'http://127.0.0.1:3000/' : '/';

// CONFFIG
function requestConfig(){
	return {
		type: CONFIG_REQUEST
	}
}

function receiveConfig(data){
	return {
		type: CONFIG_SUCCESS,
		data: data
	}
}

function configError(message){
	return {
		type: CONFIG_FAILURE,
		message: message
	}
}

export function fetchConfig(){
	return dispatch => {
		dispatch(requestConfig());

		let config = { 
			method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		return fetch(BASE_URL+'config/config.json', config)
		.then(response => {
			if (response.status >= 400) {
				throw new Error('Bad response');
			}
			return response.json();
		})
		.then(json => {
			dispatch(receiveConfig(json));
		})
		.catch(message => {
			dispatch(configError(message));
		})
	}
}