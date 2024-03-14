'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '../utils';

import { 
	TOOLS_REQUEST, 
	TOOLS_SUCCESS,
	TOOLS_FAILURE,
	TOOLS_RESET,
	TOOL_REQUEST, 
	TOOL_SUCCESS,
	TOOL_FAILURE,
	TOOL_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


export function resetTools(){
	return {
		type: TOOLS_RESET
	}
}

export function fetchTools(){
	return {
		[CALL_API]: {
			endpoint: 'tools',
			types: [TOOLS_REQUEST, TOOLS_SUCCESS, TOOLS_FAILURE]
		}
	}
}

// search tool
export function searchTools( filters){

	return {
		[CALL_API]: {
			endpoint: 'tools/search?'+complexToQueryString(filters),
			sendToken: true,
			types: [TOOLS_REQUEST, TOOLS_SUCCESS, TOOLS_FAILURE]
		}
	}
}

// Get tools of current month
export function searchMonthTools(filters){
	return {
		[CALL_API]: {
			endpoint: 'tools/month?'+complexToQueryString(filters),
			sendToken: true,
			types: [TOOLS_REQUEST, TOOLS_SUCCESS, TOOLS_FAILURE]
		}
	}
}

// dashboard my tools
export function fetchMyTools(filters){
	let type = 'mytools';
	let filtersQuery = '';

	if (filters){
		filtersQuery = '&'+complexToQueryString(filters);
	}

	return {
		[CALL_API]: {
			endpoint: 'tools/search?type='+type+filtersQuery,
			sendToken: true,
			mustAuth: true,
			types: [TOOLS_REQUEST, TOOLS_SUCCESS, TOOLS_FAILURE]
		}
	}
}

// delete collective
export function deleteTools(list){
	return {
		[CALL_API]: {
			endpoint: 'tools',
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			data: { tools: list },
			types: [TOOLS_REQUEST, TOOLS_SUCCESS, TOOLS_FAILURE]
		}
	}
}

// SINGLE RESOURCE
export function resetTool(){
	return {
		type: TOOL_RESET
	}
}

export function fetchTool(toolId){
	return {
		[CALL_API]: {
			endpoint: 'tools/details/'+toolId,
			sendToken:true,
			types: [TOOL_REQUEST, TOOL_SUCCESS, TOOL_FAILURE]
		}
	}
}

export function submitTool(data, tool){
	const endPoint = tool ? 'tools/'+tool : 'tools';
	const method = tool ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [TOOL_REQUEST, TOOL_SUCCESS, TOOL_FAILURE]
		}
	}
}

export function deleteTool(toolSlug){
	return {
		[CALL_API]: {
			endpoint: 'tools/'+toolSlug,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [TOOL_REQUEST, TOOL_SUCCESS, TOOL_FAILURE]
		}
	}
}

export function fetchPending(filters){
	let filtersQuery = filters ? '&'+complexToQueryString(filters) : '';

	return {
		[CALL_API]: {
			endpoint: 'tools/search?type=pending'+filtersQuery,
			sendToken: true,
			types: [TOOLS_REQUEST, TOOLS_SUCCESS, TOOLS_FAILURE]
		}
	}
}
export function setApproved(data, toolId){
	return {
		[CALL_API]: {
			endpoint: 'tools/approved/'+toolId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data
		}
	}
}

export function setApprovedUndo(data, toolId){
	return {
		[CALL_API]: {
			endpoint: 'tools/approved/'+toolId+'/undo',
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data: {
				data
			}
		}
	}
}