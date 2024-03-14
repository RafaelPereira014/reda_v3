import assign from 'object-assign';
import { 
	COMMENTS_REQUEST, 
  COMMENTS_SUCCESS,
  COMMENTS_FAILURE,
  COMMENTS_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, curPage: null, total: null, totalPages: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case COMMENTS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case COMMENTS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        curPage: action.data.page || null,
        total: action.data.total || null,
        totalPages: action.data.totalPages || null,
        errorMessage: null,
        errorStatus: null
      })
    case COMMENTS_FAILURE:
      return assign({}, state, {
        fetching: false,        
        errorMessage: action.message,
        errorStatus: action.status
      })
    case COMMENTS_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null,
        curPage: null,
        total: null,
        totalPages: null
      })
    default:
      return state;
  }
}