'use strict';

require('es6-promise').polyfill();

import { 
	ROLES_REQUEST, 
	ROLES_SUCCESS,
	ROLES_FAILURE
} from './action-types';
import { CALL_API } from '../middleware/api';

export function fetchRoles(){
	return {
		[CALL_API]: {
			endpoint: 'users/roles/',
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [ROLES_REQUEST, ROLES_SUCCESS, ROLES_FAILURE]
		}
	}
}

export function fetchRolesGeneric(){
	return {
		[CALL_API]: {
			endpoint: 'roles/',
			method: 'GET',
			types: [ROLES_REQUEST, ROLES_SUCCESS, ROLES_FAILURE]
		}
	}
}