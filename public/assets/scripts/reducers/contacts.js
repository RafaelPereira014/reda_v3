import assign from 'object-assign';
import { 
	CONTACTS_REQUEST, 
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,
  CONTACTS_RESET,
  TOGGLE_CONTACTS_READ
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, curPage: null, total: null, totalPages: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CONTACTS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case CONTACTS_SUCCESS:
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
    case CONTACTS_FAILURE:
      return assign({}, state, {
        fetching: false,        
        errorMessage: action.message,
        errorStatus: action.status
      })
    case CONTACTS_RESET:
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
    case TOGGLE_CONTACTS_READ:
      // CALL SINGLE RESOURCE REDUCER TO MAKE THE CHANGE
      return assign({}, state, {
        data: state.data.map(item => assign({}, item, {
          status: "READ"
        }))
      })
      
    default:
      return state;
  }
}