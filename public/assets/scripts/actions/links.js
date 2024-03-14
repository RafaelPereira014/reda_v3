'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '../utils';

import { 
	LINKS_REQUEST, 
	LINKS_SUCCESS,
	LINKS_FAILURE,
	LINKS_RESET,
	LINK_REQUEST, 
	LINK_SUCCESS,
	LINK_FAILURE,
	LINK_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetLinks(){
	return {
		type: LINKS_RESET
	}
}

export function fetchLinks(params){
	let type = null;
	if (params.type){
		type = getRequestType(params.type);
	}

	return {
		[CALL_API]: {
			endpoint: 'links?type='+type,
			types: [LINKS_REQUEST, LINKS_SUCCESS, LINKS_FAILURE]
		}
	}
}

// search link with specific params
export function searchLinks(params, filters){
	let type = null;
	if (params.type){
		type = getRequestType(params.type);
	}

	return {
		[CALL_API]: {
			endpoint: 'links/search?type='+type+'&'+complexToQueryString(filters),
			sendToken: true,
			types: [LINKS_REQUEST, LINKS_SUCCESS, LINKS_FAILURE]
		}
	}
}

// delete collective
export function deleteLinks(list){
	return {
		[CALL_API]: {
			endpoint: 'links',
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			data: { links: list },
			types: [LINKS_REQUEST, LINKS_SUCCESS, LINKS_FAILURE]
		}
	}
}

//	Single
export function resetLink(){
	return {
		type: LINK_RESET
	}
}

export function fetchLink(linkId){
	return {
		[CALL_API]: {
			endpoint: 'links/details/'+linkId,
			sendToken:true,
			types: [LINK_REQUEST, LINK_SUCCESS, LINK_FAILURE]
		}
	}
}

export function submitLink(params, data, link){
	const endPoint = link ? 'links/'+link+'?type='+getRequestType(params.type) : 'links?type='+getRequestType(params.type);
	const method = link ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [LINK_REQUEST, LINK_SUCCESS, LINK_FAILURE]
		}
	}
}

export function deleteLink(linkId){
	return {
		[CALL_API]: {
			endpoint: 'links/'+linkId,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [LINK_REQUEST, LINK_SUCCESS, LINK_FAILURE]
		}
	}
}

function getRequestType(paramsType){
	let type = null;
	if (paramsType){
		switch(paramsType){
			case 'sugestoes':
				type = 'rec';
				break;
			case 'experimenta':
				type = 'try';
				break;
		}
	}

	return type;
}