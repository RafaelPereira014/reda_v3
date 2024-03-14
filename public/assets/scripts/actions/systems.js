'use strict';

require('es6-promise').polyfill();

import { 
	SYSTEMS_REQUEST, 
	SYSTEMS_SUCCESS,
	SYSTEMS_FAILURE,
	SYSTEMS_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetSystems(){
	return {
		type: SYSTEMS_RESET
	}
}

export function fetchSystems(isRequired){
	let params = '';

	if (isRequired){
		params = '?required=true';
	}

	return {
		[CALL_API]: {
			endpoint: 'terms?&tax=sistemas_apps'+params,
			types: [SYSTEMS_REQUEST, SYSTEMS_SUCCESS, SYSTEMS_FAILURE]
		}
	}
}