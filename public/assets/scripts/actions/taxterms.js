'use strict';
import { complexToQueryString } from '#/utils';

require('es6-promise').polyfill();

import { 
	TAXTERMS_REQUEST, 
	TAXTERMS_SUCCESS,
	TAXTERMS_FAILURE,
	TAXTERMS_RESET,

	TAXTERMS_ALL_REQUEST, 
	TAXTERMS_ALL_SUCCESS,
	TAXTERMS_ALL_FAILURE,
	TAXTERMS_ALL_RESET,

	TAXTERM_REQUEST, 
	TAXTERM_SUCCESS,
	TAXTERM_FAILURE,
	TAXTERM_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

//
//	Get all with filters and pagination
//
export function resetTaxTerms(){
	return {
		type: TAXTERMS_RESET
	}
}

export function fetchTaxTerms(tax, filters={}){

	return {
		[CALL_API]: {
			endpoint: `taxonomies/${tax}/terms?${complexToQueryString(filters)}`,
			types: [TAXTERMS_REQUEST, TAXTERMS_SUCCESS, TAXTERMS_FAILURE]
		}
	}
}

//
//	Get all (generic with no pagination)
//
export function resetAllTaxTerms(){
	return {
		type: TAXTERMS_ALL_RESET
	}
}

export function fetchAllTaxTerms(tax, filters={}){

	return {
		[CALL_API]: {
			endpoint: `taxonomies/${tax}/terms?${complexToQueryString(filters)}&all=true`,
			types: [TAXTERMS_ALL_REQUEST, TAXTERMS_ALL_SUCCESS, TAXTERMS_ALL_FAILURE]
		}
	}
}

//
//	Single tax term
//
export function resetTaxTerm(){
	return {
		type: TAXTERM_RESET
	}
}

export function submitTerm(data, slug){
	const endPoint = slug ? 'terms/'+slug : 'terms';
	const method = slug ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [TAXTERM_REQUEST, TAXTERM_SUCCESS, TAXTERM_FAILURE]
		}
	}
}

export function deleteTerm(slug){
	return {
		[CALL_API]: {
			endpoint: 'terms/'+slug,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [TAXTERM_REQUEST, TAXTERM_SUCCESS, TAXTERM_FAILURE]
		}
	}
}