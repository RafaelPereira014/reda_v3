'use strict';

require('es6-promise').polyfill();

import { 
	TYPES_REQUEST, 
	TYPES_SUCCESS,
	TYPES_FAILURE,
	TYPES_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


export function resetTypes(){
	return {
		type: TYPES_RESET
	}
}


export function fetchTypes(){

	return {
		[CALL_API]: {
			endpoint: 'types',
			types: [TYPES_REQUEST, TYPES_SUCCESS, TYPES_FAILURE]
		}
	}
}