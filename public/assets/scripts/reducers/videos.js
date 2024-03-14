import assign from 'object-assign';
import { 
	VIDEOS_REQUEST, 
	VIDEOS_SUCCESS,
	VIDEOS_FAILURE,
  VIDEOS_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null, nextPageToken: null, prevPageToken: null, pageInfo: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case VIDEOS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case VIDEOS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        nextPageToken: action.data.result.nextPageToken || null,
        prevPageToken: action.data.result.prevPageToken || null,
        pageInfo: action.data.result.pageInfo || null,
        errorMessage: null,
        errorStatus: null
      })
    case VIDEOS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case VIDEOS_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null,
        nextPageToken: null,
        prevPageToken: null,
        pageInfo: null
      })
    default:
      return state;
  }
}

