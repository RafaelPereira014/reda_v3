'use strict';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

import { isNode } from '#/utils';

import { 
	TESTIMONIALS_REQUEST, 
	TESTIMONIALS_SUCCESS,
	TESTIMONIALS_FAILURE
} from './action-types';

const BASE_URL = isNode ? 'http://127.0.0.1/' : '/';

function requestTestimonials(){
	return {
		type: TESTIMONIALS_REQUEST
	}
}

function receiveTestimonials(data){
	return {
		type: TESTIMONIALS_SUCCESS,
		data: data
	}
}

function testimonialsError(message){
	return {
		type: TESTIMONIALS_FAILURE,
		message: message
	}
}

export function fetchTestimonials(){
	return dispatch => {
		dispatch(requestTestimonials());

		return fetch(BASE_URL+'assets/scripts/dummy.json')
		.then(response => {
			if (response.status >= 400) {
				throw new Error('Bad response');
			}
			return response.json();
		})
		.then(json => {
			dispatch(receiveTestimonials(json.testimonials));
		})
		.catch(message => {
			dispatch(testimonialsError(message));
		})
	}
}