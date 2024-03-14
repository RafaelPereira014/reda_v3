import assign from 'object-assign';
import { 
	TESTIMONIALS_REQUEST, 
	TESTIMONIALS_SUCCESS,
	TESTIMONIALS_FAILURE
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TESTIMONIALS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TESTIMONIALS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data,
        errorMessage: null,
        errorStatus: null
      })
    case TESTIMONIALS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message
      })
    default:
      return state;
  }
}