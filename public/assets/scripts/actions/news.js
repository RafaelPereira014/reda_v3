'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '#/utils';

import { 
	NEWS_REQUEST, 
	NEWS_SUCCESS,
	NEWS_FAILURE,
	NEWS_RESET,
	NEW_REQUEST, 
	NEW_SUCCESS,
	NEW_FAILURE,
	NEW_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetNews(){
	return [
		{
			type: NEWS_RESET
		},
		{
			type: NEW_RESET
		}
	]
}


export function fetchNews(filters){
	return {
		[CALL_API]: {
			endpoint: 'news?'+complexToQueryString(filters),
			types: [NEWS_REQUEST, NEWS_SUCCESS, NEWS_FAILURE]
		}
	}
}

export function getNewsDetails(slug){
	return {
		[CALL_API]: {
			endpoint: 'news/'+slug,
			types: [NEW_REQUEST, NEW_SUCCESS, NEW_FAILURE]
		}
	}
}

export function submitNews(data, news){
	const endPoint = news ? 'news/'+news : 'news';
	const method = news ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [NEWS_REQUEST, NEWS_SUCCESS, NEWS_FAILURE]
		}
	}
}

//	Single
export function deleteNews(slug){
	return {
		[CALL_API]: {
			endpoint: 'news/'+slug,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [NEWS_REQUEST, NEWS_SUCCESS, NEWS_FAILURE]
		}
	}
}