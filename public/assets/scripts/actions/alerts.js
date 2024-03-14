'use strict';

require('es6-promise').polyfill();

import { 
	ALERT_ADD, 
	ALERT_REMOVE
} from './action-types';


export function addAlert(message, resultType){

	return {
		type: ALERT_ADD,
		message,
		resultType
	}
}

export function removeAlert(){
	return {
		type: ALERT_REMOVE
	}
}