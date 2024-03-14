import assign from 'object-assign';
import { 
	DASHBOARD_REQUEST, 
	DASHBOARD_SUCCESS,
  DASHBOARD_FAILURE,
  DASHBOARD_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case DASHBOARD_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case DASHBOARD_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case DASHBOARD_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case DASHBOARD_RESET:
      return assign({}, state, INITIAL_STATE)
    default:
      return state;
  }
}