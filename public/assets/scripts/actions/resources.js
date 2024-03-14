'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '#/utils';
import { getType } from '#/utils/resources';

import { 
	HIGHLIGHTS_REQUEST, 
	HIGHLIGHTS_SUCCESS,
	HIGHLIGHTS_FAILURE,
	HIGHLIGHTS_RESET,
	TOGGLE_HIGHLIGHT_RESOURCES,
	TOGGLE_HIGHLIGHT_RESOURCE,
	RESOURCES_REQUEST, 
	RESOURCES_SUCCESS,
	RESOURCES_FAILURE,
	RESOURCES_RESET,
	RESOURCES_RESET_ERRORS,
	RESOURCE_REQUEST, 
	RESOURCE_SUCCESS,
	RESOURCE_FAILURE,
	RESOURCE_RESET,	
	RESOURCE_RESET_ERRORS,
	GENERIC_RESOURCE_REQUEST, 
	GENERIC_RESOURCE_SUCCESS,
	GENERIC_RESOURCE_FAILURE,
	TOGGLE_FAVORITE_RESOURCES,
	TOGGLE_FAVORITE_RESOURCE,
	RELATED_RESOURCES_REQUEST, 
	RELATED_RESOURCES_SUCCESS,
	RELATED_RESOURCES_FAILURE,
	RELATED_RESOURCES_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';


// HIGHLIGHTS
export function resetHighlights(){
	return {
		type: HIGHLIGHTS_RESET
	}
}


export function setHighlights(resourceId){
	return [
		{
			[CALL_API]: {
				endpoint: 'resources/highlight/'+resourceId,
				method: 'PUT',
				sendToken: true,
				mustAuth: true
			}
		},
		{
			type: TOGGLE_HIGHLIGHT_RESOURCES,
			id: resourceId
		}
	]
}

export function setHighlight(resourceId){
	return [
		{
			[CALL_API]: {
				endpoint: 'resources/highlight/'+resourceId,
				method: 'PUT',
				sendToken: true,
				mustAuth: true
			}
		},
		{
			type: TOGGLE_HIGHLIGHT_RESOURCE,
			id: resourceId
		}
	]
}

export function fetchHighlights(){
	return {
		[CALL_API]: {
			endpoint: 'resources/highlight',
			sendToken: true,
			types: [HIGHLIGHTS_REQUEST, HIGHLIGHTS_SUCCESS, HIGHLIGHTS_FAILURE]
		}
	}
}

// RESOURCES
export function resetResources(){
	return {
		type: RESOURCES_RESET
	}
}

export function resetResourcesErrors(){
	return {
		type: RESOURCES_RESET_ERRORS
	}
}

export function fetchResources(params, type){
	const endpoint = type ? 'resources/'+type : 'resources/recent';

	return {
		[CALL_API]: {
			endpoint: endpoint,
			sendToken: true,
			method: 'GET',
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// search resources with specific params
export function searchResources(filters){
	return {
		[CALL_API]: {
			endpoint: 'resources/search?'+complexToQueryString(filters),
			sendToken: true,
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

export function fetchDominiosTemas(params, type){
	const endpoint = 'resources/dominios-temas';

	return {
		[CALL_API]: {
			endpoint: endpoint,
			sendToken: true,
			method: 'GET',
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}





// Get resources of current month
export function searchMonthResources(filters){
	return {
		[CALL_API]: {
			endpoint: 'resources/month?'+complexToQueryString(filters),
			sendToken: true,
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// dashboard myResources
export function fetchMyResources(params, filters){
	let type = 'myresources';
	let filtersQuery = '';

	if (params && params.type){
		type = getType(params.type);
	}

	if (filters){
		filtersQuery = '&'+complexToQueryString(filters);
	}

	return {
		[CALL_API]: {
			endpoint: 'resources/search?type='+type+filtersQuery,
			sendToken: true,
			mustAuth: true,
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// dashboard myScripts
export function fetchResourcesWithMyScripts(filters){
	return {
		[CALL_API]: {
			endpoint: 'resources/search?type=resourceswithmyscripts&'+complexToQueryString(filters),
			sendToken: true,
			mustAuth: true,
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// dashboard Favorites
export function fetchMyFavorites(filters){
	return {
		[CALL_API]: {
			endpoint: 'resources/search?type=myfavorites&'+complexToQueryString(filters),
			sendToken: true,
			mustAuth: true,
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// delete collective
export function deleteResources(list){
	return {
		[CALL_API]: {
			endpoint: 'resources',
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			data: { resources: list },
			types: [RESOURCES_REQUEST, RESOURCES_SUCCESS, RESOURCES_FAILURE]
		}
	}
}

// SINGLE RESOURCE
export function resetResource(){
	return {
		type: RESOURCE_RESET
	}
}

export function resetResourceErrors(){
	return {
		type: RESOURCE_RESET_ERRORS
	}
}

export function setFavorites(resourceId){

	return [
		{
			[CALL_API]: {
				endpoint: 'resources/favorite/'+resourceId,
				method: 'PUT',
				sendToken: true,
				mustAuth: true
			}
		},
		{
			type: TOGGLE_FAVORITE_RESOURCES,
			id: resourceId
		}
	]
}

export function setFavorite(resourceId){
	return [
		{
			[CALL_API]: {
				endpoint: 'resources/favorite/'+resourceId,
				method: 'PUT',
				sendToken: true,
				mustAuth: true
			}
		},
		{
			type: TOGGLE_FAVORITE_RESOURCE,
			id: resourceId
		}
	]
}

export function setApproved(data, resourceId){
	return {
		[CALL_API]: {
			endpoint: 'resources/approved/'+resourceId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data
		}
	}
}

export function setApprovedUndo(data, resourceId){
	return {
		[CALL_API]: {
			endpoint: 'resources/approved/'+resourceId+'/undo',
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data: {
				data
			}
		}
	}
}

export function setHiddenUndo(data, resourceId){
	return {
		[CALL_API]: {
			endpoint: 'resources/hidden/'+resourceId+'/undo',
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data: {
				data
			}
		}
	}
}

export function setRating(data, resourceId){
	return {
		[CALL_API]: {
			endpoint: 'resources/rating/'+resourceId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data
		}
	}
	
}

export function fetchResource(params){
	let endPoint = 'resources/details/'+params.resource;

	/* endPoint = all ? endPoint+'?all=true' : endPoint; */

	return {
		[CALL_API]: {
			endpoint: endPoint,
			sendToken:true,
			types: [RESOURCE_REQUEST, RESOURCE_SUCCESS, RESOURCE_FAILURE]
		}
	}
}

export function fetchGenericResource(params){
	return {
		[CALL_API]: {
			endpoint: 'resources/generic-details/'+params.resource,
			types: [GENERIC_RESOURCE_REQUEST, GENERIC_RESOURCE_SUCCESS, GENERIC_RESOURCE_FAILURE]
		}
	}
}

export function submitResource(data, resource){
	const endPoint = resource ? 'resources/'+resource : 'resources';
	const method = resource ? 'PUT' : 'POST';

	return {
		[CALL_API]: {
			endpoint: endPoint,
			method: method || 'POST',
			sendToken: true,
			mustAuth: true,
			data,
			types: [RESOURCE_REQUEST, RESOURCE_SUCCESS, RESOURCE_FAILURE]
		}
	}
}

export function deleteResource(resourceSlug){
	return {
		[CALL_API]: {
			endpoint: 'resources/'+resourceSlug,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [RESOURCE_REQUEST, RESOURCE_SUCCESS, RESOURCE_FAILURE]
		}
	}
}
// HIDE RESOURCE
export function hideResource(resourceSlug){
	console.log('hideResource calling', resourceSlug);
	return {
		[CALL_API]: {
			endpoint: 'resources/hide/'+resourceSlug,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			types: [RESOURCE_REQUEST, RESOURCE_SUCCESS, RESOURCE_FAILURE]
		}
	}
}

// RELATED RESOURCES
export function resetRelatedResources(){
	return {
		type: RELATED_RESOURCES_RESET
	}
}

export function fetchRelatedResources(params, filters){
	return {
		[CALL_API]: {
			endpoint: 'resources/related/'+params.resource+'?'+complexToQueryString(filters),
			types: [RELATED_RESOURCES_REQUEST, RELATED_RESOURCES_SUCCESS, RELATED_RESOURCES_FAILURE]
		}
	}
}