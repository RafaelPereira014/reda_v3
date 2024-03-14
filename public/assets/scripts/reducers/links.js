import assign from 'object-assign';
import { 
	LINKS_REQUEST, 
	LINKS_SUCCESS,
	LINKS_FAILURE,
  LINKS_RESET,
  LINK_REQUEST, 
  LINK_SUCCESS,
  LINK_FAILURE,
  LINK_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LINKS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case LINKS_SUCCESS:
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
    case LINKS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case LINKS_RESET:
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

export function link(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LINK_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case LINK_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result
      })
    case LINK_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case LINK_RESET:
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