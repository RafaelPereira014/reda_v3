import assign from 'object-assign';
import { 
	TOOLS_REQUEST, 
	TOOLS_SUCCESS,
	TOOLS_FAILURE,
  TOOLS_RESET,
  TOOL_REQUEST, 
  TOOL_SUCCESS,
  TOOL_FAILURE,
  TOOL_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TOOLS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TOOLS_SUCCESS:
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
    case TOOLS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TOOLS_RESET:
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

export function tool(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TOOL_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TOOL_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result
      })
    case TOOL_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TOOL_RESET:
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