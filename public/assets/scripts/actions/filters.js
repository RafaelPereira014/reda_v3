'use strict';

require('es6-promise').polyfill();

// Utils
import { isNode, complexToQueryString } from '../utils';

import { 
	FILTERS_SET, 
	FILTERS_GET,
	FILTERS_RESET,
	FILTERS_RESOURCES_SET, 
	FILTERS_RESOURCES_GET,
	FILTERS_RESOURCES_RESET,
	FILTERS_APPS_SET, 
	FILTERS_APPS_GET,
	FILTERS_APPS_RESET,
	FILTERS_TOOLS_SET, 
	FILTERS_TOOLS_GET,
	FILTERS_TOOLS_RESET,
	RESOURCES_REQUEST, 
	RESOURCES_SUCCESS,
	RESOURCES_FAILURE
} from './action-types';
import { CALL_API } from '../middleware/api';


// RESOURCES FILTERS
export function getFilters(){
	return {
		type: FILTERS_GET
	}
}

export function setFilters(filters, type=null){
	!isNode && localStorage.setItem(`filters${type ? '_'+type : ''}`, JSON.stringify(filters));
	return {
		type: FILTERS_SET,
		filters
	}
}

export function resetFilters(type=null){
	!isNode && localStorage.setItem(`filters${type ? '_'+type : ''}`, null);
	return {
		type: FILTERS_RESET
	}
}

export function searchResourcesFilters(filters){
	return {
		[CALL_API]: {
			endpoint: 'resources/search?'+complexToQueryString(filters),
			sendToken: true,
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// FILTERS APPS
export function getFiltersApps(){
	return {
		type: FILTERS_APPS_GET
	}
}

export function setFiltersApps(filters){
	!isNode && localStorage.setItem('filters_apps', JSON.stringify(filters));
	return {
		type: FILTERS_APPS_SET,
		filters
	}
}

export function resetFiltersApps(){
	!isNode && localStorage.setItem('filters_apps', null);
	return {
		type: FILTERS_APPS_RESET
	}
}

// FILTERS RESOURCES
export function getFiltersResources(){
	return {
		type: FILTERS_RESOURCES_GET
	}
}

export function setFiltersResources(filters){
	!isNode && localStorage.setItem('filters_resources', JSON.stringify(filters));
	return {
		type: FILTERS_RESOURCES_SET,
		filters
	}
}

export function resetFiltersResources(){
	!isNode && localStorage.setItem('filters_resources', null);
	return {
		type: FILTERS_RESOURCES_RESET
	}
}

// FILTERS LINKS
export function getFiltersTools(){
	return {
		type: FILTERS_TOOLS_GET
	}
}

export function setFiltersTools(filters){
	!isNode && localStorage.setItem('filters_tools', JSON.stringify(filters));
	return {
		type: FILTERS_TOOLS_SET,
		filters
	}
}

export function resetFiltersTools(){
	!isNode && localStorage.setItem('filters_tools', null);
	return {
		type: FILTERS_TOOLS_RESET
	}
}
