import assign from 'object-assign';
import { 
	NEWS_REQUEST, 
	NEWS_SUCCESS,
	NEWS_FAILURE,
  NEWS_RESET,
  NEW_REQUEST, 
	NEW_SUCCESS,
	NEW_FAILURE,
  NEW_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { 
  fetching: false,
  fetched: false,
  data: null,
  errorMessage: null,
  errorStatus: null,
  curPage: null,
  total: null,
  totalPages: null
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case NEWS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case NEWS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        curPage: action.data.page || null,
        total: action.data.total || null,
        totalPages: action.data.totalPages || null,
        resource: action.data.resource || null,
        errorMessage: null,
        errorStatus: null
      })
    case NEWS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case NEWS_RESET:
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

export const newsDetail = function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case NEW_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case NEW_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case NEW_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case NEW_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null,
      })
    default:
      return state;
  }
}