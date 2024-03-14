import assign from 'object-assign';
import { 
	TYPES_REQUEST, 
	TYPES_SUCCESS,
	TYPES_FAILURE,
  TYPES_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TYPES_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TYPES_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case TYPES_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TYPES_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null
      })
    default:
      return state;
  }
}

