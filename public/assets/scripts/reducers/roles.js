import assign from 'object-assign';
import { 
	ROLES_REQUEST, 
	ROLES_SUCCESS,
	ROLES_FAILURE
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case ROLES_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case ROLES_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case ROLES_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    default:
      return state;
  }
}