'use strict';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

import { isNode } from '#/utils';

import { 
	HEADERS_REQUEST, 
	HEADERS_SUCCESS,
	HEADERS_FAILURE
} from './action-types';

const BASE_URL = isNode ? 'http://127.0.0.1/' : '/';

// FORMATS
function requestHeaders(){
	return {
		type: HEADERS_REQUEST
	}
}

function receiveHeaders(data){
	return {
		type: HEADERS_SUCCESS,
		data: data
	}
}

function headersError(message){
	return {
		type: HEADERS_FAILURE,
		message: message
	}
}

export function fetchHeader(header, params){
	return dispatch => {
		dispatch(requestHeaders());

		return fetch(BASE_URL+'assets/scripts/dummy.json')
		.then(response => {
			if (response.status >= 400) {
				throw new Error('Bad response');
			}
			return response.json();
		})
		.then(json => {
			const headers = params ? json.headers[header][params] : json.headers[header];

			dispatch(receiveHeaders(headers));
		})
		.catch(message => {
			dispatch(headersError(message));
		})
	}
}