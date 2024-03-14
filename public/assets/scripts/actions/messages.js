'use strict';

require('es6-promise').polyfill();

import { 
	MESSAGES_REQUEST, 
	MESSAGES_SUCCESS,
	MESSAGES_FAILURE,
	MESSAGES_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


export function resetMessages(){
	return {
		type: MESSAGES_RESET
	}
}


export function fetchMessages(params, type, contentType){
	let mesType = type || 'disapprove';
	return {
		[CALL_API]: {
			endpoint: 'messages?type='+mesType+'&content='+contentType,
			sendToken: true,
			mustAuth: true,
			types: [MESSAGES_REQUEST, MESSAGES_SUCCESS, MESSAGES_FAILURE]
		}
	}
}