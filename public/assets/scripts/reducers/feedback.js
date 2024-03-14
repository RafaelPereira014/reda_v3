import assign from 'object-assign';
import { 
	FEEDBACK_REQUEST, 
	FEEDBACK_SUCCESS,
	FEEDBACK_FAILURE,
  FEEDBACK_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FEEDBACK_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case FEEDBACK_SUCCESS:

      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case FEEDBACK_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case FEEDBACK_RESET:
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

