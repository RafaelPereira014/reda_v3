import assign from 'object-assign';
import { 
	TERMS_REQUEST, 
  TERMS_SUCCESS,
  TERMS_FAILURE,
  TERMS_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errors: null, isAuthenticated: false };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TERMS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TERMS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case TERMS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errors: action.errors
      })
    case TERMS_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errors: null
      })
    default:
      return state;
  }
}