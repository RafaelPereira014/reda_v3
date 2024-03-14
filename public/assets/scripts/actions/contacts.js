'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '#/utils';

import { 
	CONTACTS_REQUEST, 
	CONTACTS_SUCCESS,
	CONTACTS_FAILURE,
	CONTACTS_RESET,
	TOGGLE_CONTACTS_READ
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetContacts(){
	return {
		type: CONTACTS_RESET
	}
}

export function fetchContacts(params, filters){
	return {
		[CALL_API]: {
			endpoint: 'contacts/'+params.resource+'?'+complexToQueryString(filters),
			method: 'GET',
			sendToken: true,
			types: [CONTACTS_REQUEST, CONTACTS_SUCCESS, CONTACTS_FAILURE]
		}
	}
}

export function fetchUserContacts(filters = null){

	let extra = '';
	if(filters){
		extra+='?'+complexToQueryString(filters);
	}

	return {
		[CALL_API]: {
			endpoint: 'contacts/user/'+extra,
			method: 'GET',
			sendToken: true,
			types: [CONTACTS_REQUEST, CONTACTS_SUCCESS, CONTACTS_FAILURE]
		}
	}
}

export function addContact(message, resource){
	return {
		[CALL_API]: {
			endpoint: 'contacts/'+resource,
			method: 'POST',
			sendToken: true,
			mustAuth: true,
			data: message,
			types: [CONTACTS_REQUEST, CONTACTS_SUCCESS, CONTACTS_FAILURE]
		}
	}
}

// Set contact as READ
export function setContactRead(resource){
	return [
		{
			[CALL_API]: {
				endpoint: 'contacts/'+resource+'/read',
				method: 'PUT',
				sendToken: true,
				mustAuth: true
			}
		},
		{
			type: TOGGLE_CONTACTS_READ
		}
	]
}