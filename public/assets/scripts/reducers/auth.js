import assign from 'object-assign';
import { 
	AUTH_REQUEST, 
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_RESET,
  LOGOUT_REQUEST,
  SIGNUP_REQUEST, 
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUPCONFIRM_REQUEST, 
  SIGNUPCONFIRM_SUCCESS,
  SIGNUPCONFIRM_FAILURE,
  AUTH_RESET_ERRORS
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errors: null, isAuthenticated: false, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case AUTH_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case AUTH_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: {
          user: action.data.user
        },
        isAuthenticated: true,
        errors: null,
        errorMessage: null,
        errorStatus: null
      })
    case AUTH_FAILURE:
      return assign({}, state, {
        fetching: false,
        errors: action.errors,
        errorMessage: action.errorMessage || action.message || null,
        errorStatus: action.errorStatus || action.status || null
      })
    case LOGOUT_REQUEST:
      return assign({}, state, INITIAL_STATE)
    // Signup
    case SIGNUP_REQUEST:
      return assign({}, state, {
        fetching: true,
        errors: null,
        errorMessage: null,
        errorStatus: null
      })
    case SIGNUP_SUCCESS:
      return assign({}, state, {
        fetching: false,
        errors: null,
        errorMessage: null,
        errorStatus: null
      })
    case SIGNUP_FAILURE:
      return assign({}, state, {
        fetching: false,
        errors: action.errors,
        errorMessage: action.errorMessage || null,
        errorStatus: action.errorStatus || null
      })
    // Signup confirm
    case SIGNUPCONFIRM_REQUEST:
      return assign({}, state, {
        fetching: true,
        fetched: false,
        errors: null,
        errorMessage: null,
        errorStatus: null
      })
    case SIGNUPCONFIRM_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        errors: null,
        errorMessage: null,
        errorStatus: null
      })
    case SIGNUPCONFIRM_FAILURE:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        errors: action.errors,
        errorMessage: action.errorMessage || null,
        errorStatus: action.errorStatus || null
      })
    case AUTH_RESET_ERRORS:
      return assign({}, state, {
        errors: null,
        errorMessage: null,
        errorStatus: null
      }) 
    case AUTH_RESET:
      return assign({}, state, {
        fetching: false,
        errors: null,
        errorMessage: null,
        errorStatus: null
      }) 
    default:
      return state;
  }
}