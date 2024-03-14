'use strict';

require('es6-promise').polyfill();

// Utils
import { complexToQueryString } from '#/utils';

import { 
	USER_REQUEST, 
	USER_SUCCESS,
	USER_FAILURE,
	USERS_REQUEST, 
	USERS_SUCCESS,
	USERS_FAILURE,
	USERS_SET_ROLE,
	USERS_RESET,
	AUTH_REQUEST, 
	AUTH_SUCCESS,
	AUTH_FAILURE
} from './action-types';
import { CALL_API } from '../middleware/api';

export function fetchUserData(){
	return {
		[CALL_API]: {
			endpoint: 'users/profile/',
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE]
		}
	}
}

export function updateUser(data, userId){
	return {
		[CALL_API]: {
			endpoint: 'users/profile/'+userId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data,
			types: [AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE]
		}
	}
}

export function resetUsers(){
	USERS_RESET
	return {
		type: USERS_RESET
	}
}

export function searchMonthUsers(filters){
	return {
		[CALL_API]: {
			endpoint: 'users/month?'+complexToQueryString(filters),
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE]
		}
	}
}

// USERS LIST AND ACTIONS
export function searchUsers(filters){
	return {
		[CALL_API]: {
			endpoint: 'users/list-all/?'+complexToQueryString(filters),
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE]
		}
	}
}

export function setRole(data, userId){
	return [
		{
			[CALL_API]: {
				endpoint: 'users/set-role/',
				method: 'PUT',
				sendToken: true,
				mustAuth: true,
				data: {
				user: userId,
				role: data.type
				}
			}
		},
		{
			type: USERS_SET_ROLE,
			data: data,
			id: userId
		}
	]
}

export function updateUsers(data, userId){
	return {
		[CALL_API]: {
			endpoint: 'users/set-role/'+userId,
			method: 'PUT',
			sendToken: true,
			mustAuth: true,
			data,
			types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE]
		}
	}
}

export function deleteUser(userId){
	return {
		[CALL_API]: {
			endpoint: 'users/'+userId,
			method: 'DELETE',
			sendToken: true,
			mustAuth: true,
			types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE]
		}
	}
}