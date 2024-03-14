'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '#/utils';

import { 
	COMMENTS_REQUEST, 
	COMMENTS_SUCCESS,
	COMMENTS_FAILURE,
	COMMENTS_RESET,
	BADWORDS_REQUEST, 
	BADWORDS_SUCCESS,
	BADWORDS_FAILURE,
	BADWORDS_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetComments(){
	return {
		type: COMMENTS_RESET
	}
}

export function fetchComments(params, filters){
	return {
		[CALL_API]: {
			endpoint: 'comments/'+params.resource+'?'+complexToQueryString(filters),
			method: 'GET',
			sendToken: true,
			types: [COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE]
		}
	}
}

export function fetchPending(filters){
	return {
		[CALL_API]: {
			endpoint: 'comments/pending?'+complexToQueryString(filters),
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE]
		}
	}
}

export function setApproved(data, commentId){
	return {
		[CALL_API]: {
			endpoint: 'comments/approved/'+commentId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data
		}
	}
}

//	========================================
//	Badwords
//	========================================
export function fetchBadwords(filters){
	let filtersQuery = filters ? '?'+complexToQueryString(filters) : '';

	return {
		[CALL_API]: {
			endpoint: 'badwords/'+filtersQuery,
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [BADWORDS_REQUEST, BADWORDS_SUCCESS, BADWORDS_FAILURE]
		}
	}
}

export function resetBadwords(){
	return {
		type: BADWORDS_RESET
	}
}

export function addBadword(word){
	return {
		[CALL_API]: {
			endpoint: 'badwords/',
			method: 'POST',
			sendToken: true,
			mustAuth: true,
			data: {title: word},
			types: [BADWORDS_REQUEST, BADWORDS_SUCCESS, BADWORDS_FAILURE]
		}
	}
}

export function deleteBadword(word){
	return {
		[CALL_API]: {
			endpoint: 'badwords/'+word,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [BADWORDS_REQUEST, BADWORDS_SUCCESS, BADWORDS_FAILURE]
		}
	}
}