'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '../utils';

import { 
	SCRIPTS_REQUEST, 
	SCRIPTS_SUCCESS,
	SCRIPTS_FAILURE,
	SCRIPTS_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


export function resetScripts(){
	return {
		type: SCRIPTS_RESET
	}
}

export function fetchScripts(resourceId){

	return {
		[CALL_API]: {
			endpoint: 'scripts/'+resourceId,
			sendToken: true,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function fetchPending(filters){
	let filtersQuery = filters ? '&'+complexToQueryString(filters) : '';

	return {
		[CALL_API]: {
			endpoint: 'scripts/search?type=pending'+filtersQuery,
			sendToken: true,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function fetchUserScripts(resourceId){
	
	return {
		[CALL_API]: {
			endpoint: 'scripts/user-scripts/'+resourceId,
			sendToken: true,
			mustAuth: true,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function fetchScript(scriptId){
	
	return {
		[CALL_API]: {
			endpoint: 'scripts/single-script/'+scriptId,
			sendToken: true,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function deleteScript(scriptId){
	return {
		[CALL_API]: {
			endpoint: 'scripts/'+scriptId,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function deleteScripts(list){
	return {
		[CALL_API]: {
			endpoint: 'scripts',
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			data: { scripts: list },
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function submitScripts(data, resourceId){
	return {
		[CALL_API]: {
			endpoint: 'scripts/'+resourceId,
			method: 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function submitSingleScript(data, resource, scriptId){
	const endPoint = scriptId ? 'scripts/single-script/'+scriptId : 'scripts/single-script/'+resource;
	const method = scriptId ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [SCRIPTS_REQUEST, SCRIPTS_SUCCESS, SCRIPTS_FAILURE]
		}
	}
}

export function setApproved(data, scriptId){
	return {
		[CALL_API]: {
			endpoint: 'scripts/approved/'+scriptId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data
		}
	}
}

export function setApprovedUndo(data, scriptId){
	return {
		[CALL_API]: {
			endpoint: 'scripts/approved/'+scriptId+'/undo',
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data: {
				data
			}
		}
	}
}