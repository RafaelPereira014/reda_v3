'use strict';

require('es6-promise').polyfill();

import { 
	DASHBOARD_REQUEST, 
	DASHBOARD_SUCCESS,
	DASHBOARD_FAILURE,
	DASHBOARD_RESET
} from './action-types';
import { CALL_API } from '../middleware/api';

export function fetchDashboardResume(){
	return {
		[CALL_API]: {
			endpoint: 'dashboard/',
			method: 'GET',
			sendToken: true,
			mustAuth: true,
			types: [DASHBOARD_REQUEST, DASHBOARD_SUCCESS, DASHBOARD_FAILURE]
		}
	}
}

export function resetDashboardResume(){
	return {
		type: DASHBOARD_RESET
	}
}