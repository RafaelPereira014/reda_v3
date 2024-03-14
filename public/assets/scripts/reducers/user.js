import assign from 'object-assign';
import { 
	USER_REQUEST, 
	USER_SUCCESS,
	USER_FAILURE,
  USERS_REQUEST, 
  USERS_SUCCESS,
  USERS_FAILURE,
  USERS_SET_ROLE,
  USERS_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export function user(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case USER_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data,
        errorMessage: null,
        errorStatus: null
      })
    case USER_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case USERS_SET_ROLE:

      if (state.id != action.id){
        return state;
      }

      

      return assign({}, 
        state, 
        {
          Role: action.data
        }
      );
    default:
      return state;
  }
}

export function users(state = INITIAL_STATE, action){
  switch(action.type) {
    case USERS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case USERS_SUCCESS:
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
    case USERS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case USERS_SET_ROLE:
      // CALL SINGLE USER REDUCER TO MAKE THE CHANGE
      return assign({}, state, {
        data: state.data.map(item => user(item, action))
        
      })
    case USERS_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        curPage: null,
        total: null,
        totalPages: null,
        data: null,
        errorMessage: null,
        errorStatus: null
      }) 
    default:
      return state;
  }
}