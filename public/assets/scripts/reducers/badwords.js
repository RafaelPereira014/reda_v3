import assign from 'object-assign';
import { 
	BADWORDS_REQUEST, 
	BADWORDS_SUCCESS,
	BADWORDS_FAILURE,
  BADWORDS_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case BADWORDS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case BADWORDS_SUCCESS:

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
    case BADWORDS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case BADWORDS_RESET:
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

