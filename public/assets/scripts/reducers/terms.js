import assign from 'object-assign';
import { 
	TERMSANDCONDITIONS_REQUEST, 
	TERMSANDCONDITIONS_SUCCESS,
  TERMSANDCONDITIONS_FAILURE,
  TAXTERMS_REQUEST, 
	TAXTERMS_SUCCESS,
	TAXTERMS_FAILURE,
  TAXTERMS_RESET,
  
  TAXTERMS_ALL_REQUEST, 
	TAXTERMS_ALL_SUCCESS,
	TAXTERMS_ALL_FAILURE,
  TAXTERMS_ALL_RESET,
  
  TAXTERM_REQUEST, 
	TAXTERM_SUCCESS,
	TAXTERM_FAILURE,
	TAXTERM_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TERMSANDCONDITIONS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TERMSANDCONDITIONS_SUCCESS:

      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data,
        errorMessage: null,
        errorStatus: null
      })
    case TERMSANDCONDITIONS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    default:
      return state;
  }
}

export function taxTerms(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TAXTERMS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TAXTERMS_SUCCESS:
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
    case TAXTERMS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TAXTERMS_RESET:
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

export function allTaxTerms(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TAXTERMS_ALL_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TAXTERMS_ALL_SUCCESS:
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
    case TAXTERMS_ALL_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TAXTERMS_ALL_RESET:
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

export function taxTerm(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TAXTERM_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TAXTERM_SUCCESS:
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
    case TAXTERM_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TAXTERM_RESET:
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