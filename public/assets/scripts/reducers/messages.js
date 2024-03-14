import assign from 'object-assign';
import { 
	MESSAGES_REQUEST, 
	MESSAGES_SUCCESS,
	MESSAGES_FAILURE,
  MESSAGES_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case MESSAGES_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case MESSAGES_SUCCESS:

      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case MESSAGES_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case MESSAGES_RESET:
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

