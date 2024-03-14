import assign from 'object-assign';
import { 
	APPS_REQUEST, 
	APPS_SUCCESS,
	APPS_FAILURE,
  APPS_RESET,
  APP_REQUEST, 
  APP_SUCCESS,
  APP_FAILURE,
  APP_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case APPS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case APPS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        curPage: action.data.page,
        total: action.data.total,
        totalPages: action.data.totalPages,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case APPS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case APPS_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null,
        curPage: 0,
        total: 0,
        totalPages: 0,
      })
    default:
      return state;
  }
}

export function app(state = INITIAL_STATE, action) {
  switch(action.type) {
    case APP_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case APP_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case APP_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case APP_RESET:
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