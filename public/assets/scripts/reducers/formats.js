import assign from 'object-assign';
import { 
	FORMATS_REQUEST, 
	FORMATS_SUCCESS,
	FORMATS_FAILURE,
  FORMATS_RESET,
  FORMATS_ALL_REQUEST, 
  FORMATS_ALL_SUCCESS,
  FORMATS_ALL_FAILURE,
  FORMATS_ALL_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FORMATS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case FORMATS_SUCCESS:

      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case FORMATS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case FORMATS_RESET:
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

export function formatsAll(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FORMATS_ALL_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case FORMATS_ALL_SUCCESS:

      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case FORMATS_ALL_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case FORMATS_ALL_RESET:
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