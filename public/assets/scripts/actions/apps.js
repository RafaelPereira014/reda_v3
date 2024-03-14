'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '../utils';

import { 
	APPS_REQUEST, 
	APPS_SUCCESS,
	APPS_FAILURE,
	APPS_RESET,
	APP_REQUEST, 
	APP_SUCCESS,
	APP_FAILURE,
	APP_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function resetApps(){
	return {
		type: APPS_RESET
	}
}

export function fetchApps(){
	return {
		[CALL_API]: {
			endpoint: 'apps',
			types: [APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE]
		}
	}
}

// Get apps of current month
export function searchMonthApps(filters){
	return {
		[CALL_API]: {
			endpoint: 'apps/month?'+complexToQueryString(filters),
			sendToken: true,
			types: [APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE]
		}
	}
}

// search apps with specific params
export function searchApps(filters){

	return {
		[CALL_API]: {
			endpoint: 'apps/search?'+complexToQueryString(filters),
			sendToken: true,
			types: [APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE]
		}
	}
}

// dashboard my apps
export function fetchMyApps(filters){
	let type = 'myapps';
	let filtersQuery = '';

	if (filters){
		filtersQuery = '&'+complexToQueryString(filters);
	}

	return {
		[CALL_API]: {
			endpoint: 'apps/search?type='+type+filtersQuery,
			sendToken: true,
			mustAuth: true,
			types: [APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE]
		}
	}
}

// delete collective
export function deleteApps(list){
	return {
		[CALL_API]: {
			endpoint: 'apps',
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			data: { apps: list },
			types: [APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE]
		}
	}
}

// SINGLE
export function resetApp(){
	return {
		type: APP_RESET
	}
}

export function fetchApp(params){
	return {
		[CALL_API]: {
			endpoint: 'apps/details/'+params.app,
			sendToken:true,
			types: [APP_REQUEST, APP_SUCCESS, APP_FAILURE]
		}
	}
}

export function submitApp(data, app){
	const endPoint = app ? 'apps/'+app : 'apps';
	const method = app ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [APP_REQUEST, APP_SUCCESS, APP_FAILURE]
		}
	}
}

export function deleteApp(appId){
	return {
		[CALL_API]: {
			endpoint: 'apps/'+appId,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [APP_REQUEST, APP_SUCCESS, APP_FAILURE]
		}
	}
}

export function fetchPending(filters){
	let filtersQuery = filters ? '&'+complexToQueryString(filters) : '';

	return {
		[CALL_API]: {
			endpoint: 'apps/search?type=pending'+filtersQuery,
			sendToken: true,
			types: [APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE]
		}
	}
}
export function setApproved(data, appId){
	return {
		[CALL_API]: {
			endpoint: 'apps/approved/'+appId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data
		}
	}
}

export function setApprovedUndo(data, appId){
	return {
		[CALL_API]: {
			endpoint: 'apps/approved/'+appId+'/undo',
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data: {
				data
			}
		}
	}
}