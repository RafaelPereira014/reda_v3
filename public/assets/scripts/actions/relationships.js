'use strict';
import { complexToQueryString } from '#/utils';

require('es6-promise').polyfill();

import _ from 'lodash';

import { 
	TERMS_RELS_REQUEST, 
	TERMS_RELS_SUCCESS,
	TERMS_RELS_FAILURE,
	TERMS_RELS_RESET,
	TERMS_RELS_SET_TERM,
	TERMS_RELS_SET,
	TERMS_RELS_ADD_ROW,
	TERMS_RELS_REMOVE_ROW,
	TERMS_RELS_SEARCH,

	TERMS_RELS_UPDATE_REQUEST,
	TERMS_RELS_UPDATE_SUCCESS,
	TERMS_RELS_UPDATE_FAILURE
} from './action-types';
import { CALL_API } from '../middleware/api';

//
//	Get all with filters and pagination
//
export function resetTermsRels(){
	return {
		type: TERMS_RELS_RESET
	}
}

export function fetchTermsRels(filters={}){
	let finalFilters = _.cloneDeep(filters);

	if(finalFilters.filters){
		let terms = [];
		Object.keys(finalFilters.filters).map(key => {
			terms = terms.concat(finalFilters.filters[key] || []);
		})

		finalFilters.filters = {
			terms
		};
	}

	return {
		[CALL_API]: {
			endpoint: `relationships?${complexToQueryString(finalFilters)}`,
			types: [TERMS_RELS_REQUEST, TERMS_RELS_SUCCESS, TERMS_RELS_FAILURE]
		}
	}
}



//	Change term in level and relationship
export function changeRelTerm(term, level, idx){

	return [
		{
			type: TERMS_RELS_SET_TERM,
			level,
			idx,
			term
		}
	]
}

//	Change term in level and relationship
export function changeRel(data, idx){
	return [
		{
			type: TERMS_RELS_SET,
			idx,
			data
		}
	]
}

//	Change term in level and relationship
export function submitRelChanges(terms, relId = null, idx){

	let termsArr = [];

	Object.keys(terms).map(termKey => {
		
		if(termKey!=='id' && termKey.indexOf('term_id_')>=0){
			let res = termKey.split('term_id_');

			if(res[1] && terms[termKey]){
				termsArr.push({
					level: parseInt(res[1]),
					term_id: parseInt(terms[termKey])
				})
			}			
		}
		
	});

	return {
			[CALL_API]: {
				endpoint: relId ? 'relationships/'+relId : 'relationships',
				method: relId ? 'PUT' : 'POST',
				sendToken: true,
				mustAuth: true,
				data: {
					terms: termsArr
				},
				compData:{
					index: idx
				},
				types: [TERMS_RELS_UPDATE_REQUEST, TERMS_RELS_UPDATE_SUCCESS, TERMS_RELS_UPDATE_FAILURE]
			}
		}
	
}

export function addRelTermRow(){
	return [
		{
			type: TERMS_RELS_ADD_ROW,
		}
	]
}

export function searchTerm(data){
	return [
		{
			type: TERMS_RELS_SEARCH,
			data
		}
	]
}

export function deleteRelTermRow(idx, relId = null){
	
	let requests = [
		{
			type: TERMS_RELS_REMOVE_ROW,
			idx
		}
	];

	if(relId){
		requests.push({
			[CALL_API]: {
				endpoint: 'relationships/'+relId,
				method: 'DELETE',
				sendToken: true,
				mustAuth: true
			}
		},)
	}


	return requests
}