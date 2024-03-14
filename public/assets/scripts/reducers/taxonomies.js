import assign from 'object-assign';
import { 
	TAXONOMIES_REQUEST, 
	TAXONOMIES_SUCCESS,
	TAXONOMIES_FAILURE,
  TAXONOMIES_RESET,
  TAXONOMY_REQUEST,
  TAXONOMY_SUCCESS,
  TAXONOMY_FAILURE,
  TAXONOMY_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TAXONOMIES_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TAXONOMIES_SUCCESS:
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
    case TAXONOMIES_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TAXONOMIES_RESET:
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

export function taxonomy(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TAXONOMY_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TAXONOMY_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case TAXONOMY_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TAXONOMY_RESET:
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