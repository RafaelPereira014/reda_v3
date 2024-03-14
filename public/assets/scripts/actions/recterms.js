'use strict';

require('es6-promise').polyfill();

import { 
	TERMS_REQUEST, 
	TERMS_SUCCESS,
	TERMS_FAILURE,
	TERMS_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


export function resetRecTerms(){
	return {
		type: TERMS_RESET
	}
}

export function fetchRecTerms(query, isRequired){
	let params = '';

    if(query && query.length>0){
        query.map( param => {
            if(params===''){
                params += '?'
            }else{
                params += '&';
            }
            params += param[0]+'='+param[1];
        })
    }

	if (isRequired){
		params += '&required=true';
	}

	return {
		[CALL_API]: {
			endpoint: 'terms'+params,
			types: [TERMS_REQUEST, TERMS_SUCCESS, TERMS_FAILURE]
		}
	}
}