'use strict';

require('es6-promise').polyfill();

import { 
	LANGUAGES_REQUEST, 
	LANGUAGES_SUCCESS,
	LANGUAGES_FAILURE,
	LANGUAGES_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetLanguages(){
	return {
		type: LANGUAGES_RESET
	}
}


export function fetchLanguages(isRequired){
	let params = '';

	if (isRequired){
		params = '?required=true';
	}

	return {
		[CALL_API]: {
			endpoint: 'languages'+params,
			types: [LANGUAGES_REQUEST, LANGUAGES_SUCCESS, LANGUAGES_FAILURE]
		}
	}
}