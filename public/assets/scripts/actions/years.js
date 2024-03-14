'use strict';

require('es6-promise').polyfill();

import { 
	YEARS_REQUEST, 
	YEARS_SUCCESS,
	YEARS_FAILURE,
	YEARS_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


// YEARS
export function resetYears(){
	return {
		type: YEARS_RESET
	}
}


export function fetchYears(isRequired){

	let params = '';

	if (isRequired){
		params = '?required=true';
	}

	return {
		[CALL_API]: {
			endpoint: 'terms/?tax=anos_resources'+params,
			types: [YEARS_REQUEST, YEARS_SUCCESS, YEARS_FAILURE]
		}
	}
}