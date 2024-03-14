'use strict';

require('es6-promise').polyfill();

import { 
	FEEDBACK_REQUEST, 
	FEEDBACK_SUCCESS,
	FEEDBACK_FAILURE,
} from './action-types';
import { CALL_API } from '../middleware/api';

export function submitForm(data){
	return {
		[CALL_API]: {
			endpoint: 'feedback',
			method: 'POST',
			data,
			types: [FEEDBACK_REQUEST, FEEDBACK_SUCCESS, FEEDBACK_FAILURE]
		}
	}
}