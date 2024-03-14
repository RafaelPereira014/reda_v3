'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '../utils';

import { 
	TAXONOMIES_REQUEST, 
	TAXONOMIES_SUCCESS,
	TAXONOMIES_FAILURE,
	TAXONOMIES_RESET,
	TAXONOMY_REQUEST,
	TAXONOMY_SUCCESS,
	TAXONOMY_FAILURE,
	TAXONOMY_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


// TAXONOMIES

export function resetTaxonomies(){
	return {
		type: TAXONOMIES_RESET
	}
}

export function fetchTaxonomies(query, isRequired){
	let params = '';

    if(query && query.length>0){
        query.map( param => {
            if(params===''){
                params += '?'
            }else{
                params += '&';
            }
			
			
			if(Array.isArray(param.value)){
				param.value.map( (row, idx) => {
					if(idx>0){
						params += '&';
					}
					params += param.key+"[]="+row;
				})
			}else{
				params += param.key+'='+param.value;
			}
        })
    }

	if (isRequired){
		params += '&required=true';
	}

	return {
		[CALL_API]: {
			endpoint: 'taxonomies'+params,
			types: [TAXONOMIES_REQUEST, TAXONOMIES_SUCCESS, TAXONOMIES_FAILURE]
		}
	}
}

export function searchTaxonomies(filters, query){
	

	let params = '';

    if(query && query.length>0){
        query.map( (param) => {
					params += '&';
			
			
					if(Array.isArray(param.value)){
						param.value.map( (row, idx) => {
							if(idx>0){
								params += '&';
							}
							params += param.key+"[]="+row;
						})
					}else{
						params += param.key+'='+param.value;
					}
        })
    }


	return {
		[CALL_API]: {
			endpoint: 'taxonomies/search?'+complexToQueryString(filters)+params,
			types: [TAXONOMIES_REQUEST, TAXONOMIES_SUCCESS, TAXONOMIES_FAILURE]
		}
	}
}

//
//	Taxonomy - Single
//
export function resetTaxonomy(){
	return {
		type: TAXONOMY_RESET
	}
}

export function submitTaxonomy(data, slug){
	const endPoint = slug ? 'taxonomies/'+slug : 'taxonomies';
	const method = slug ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			/* types: [TAXONOMY_REQUEST, TAXONOMY_SUCCESS, TAXONOMY_FAILURE] */
		}
	}
}

export function fetchTaxonomy(slug){

	return {
		[CALL_API]: {
			endpoint: 'taxonomies/'+slug,
			types: [TAXONOMY_REQUEST, TAXONOMY_SUCCESS, TAXONOMY_FAILURE]
		}
	}
}

export function deleteTaxonomy(slug){
	return {
		[CALL_API]: {
			endpoint: 'taxonomies/'+slug,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [TAXONOMY_REQUEST, TAXONOMY_SUCCESS, TAXONOMY_FAILURE]
		}
	}
}