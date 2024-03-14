import assign from 'object-assign';
import { 
	HIGHLIGHTS_REQUEST, 
	HIGHLIGHTS_SUCCESS,
	HIGHLIGHTS_FAILURE,
  HIGHLIGHTS_RESET,
  TOGGLE_HIGHLIGHT_RESOURCES,
  TOGGLE_HIGHLIGHT_RESOURCE,
  RESOURCES_REQUEST, 
  RESOURCES_SUCCESS,
  RESOURCES_FAILURE,
  RESOURCES_RESET,
  RESOURCES_RESET_ERRORS,
  RESOURCE_REQUEST, 
  RESOURCE_SUCCESS,
  RESOURCE_FAILURE,
  RESOURCE_RESET,
  RESOURCE_RESET_ERRORS,
  GENERIC_RESOURCE_REQUEST, 
  GENERIC_RESOURCE_SUCCESS,
  GENERIC_RESOURCE_FAILURE,
  GENERIC_RESOURCE_RESET,
  GENERIC_RESOURCE_RESET_ERRORS,
  TOGGLE_FAVORITE_RESOURCES,
  TOGGLE_FAVORITE_RESOURCE,
  RELATED_RESOURCES_REQUEST, 
  RELATED_RESOURCES_SUCCESS,
  RELATED_RESOURCES_FAILURE,
  RELATED_RESOURCES_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false, fetched: false, data: null, errorMessage: null, errorStatus: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case HIGHLIGHTS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case HIGHLIGHTS_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result,
        errorMessage: null,
        errorStatus: null
      })
    case HIGHLIGHTS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })  
    case HIGHLIGHTS_RESET:
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

export function resources(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RESOURCES_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case RESOURCES_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        curPage: action.data.page,
        total: action.data.total,
        totalPages: action.data.totalPages,
        data: action.data.result
      })
    case RESOURCES_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case RESOURCES_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null,
        curPage: 0,
        total: 0,
        totalPages: 0,
      })
    case RESOURCES_RESET_ERRORS:
      return assign({}, state, {
        errorMessage: null,
        errorStatus: null
      })
    case TOGGLE_HIGHLIGHT_RESOURCES:
      
      // CALL SINGLE RESOURCE REDUCER TO MAKE THE CHANGE
      return assign({}, state, {
        data: state.data.map(item => resource(item, action))
      })

    case TOGGLE_FAVORITE_RESOURCES:
      let data = null;

      // CALL SINGLE RESOURCE REDUCER TO MAKE THE CHANGE
      return assign({}, state, {
        data: state.data.map(item => resource(item, action))
      })

    default:
      return state;
  }
};

export function resource(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RESOURCE_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case RESOURCE_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result
      })
    case RESOURCE_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case RESOURCE_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null
      })
    case RESOURCE_RESET_ERRORS:
      return assign({}, state, {
        errorMessage: null,
        errorStatus: null
      })

    // HIGHLIGHT from all resources list
    case TOGGLE_HIGHLIGHT_RESOURCES:
      if (state.id != action.id){
        return state;
      }

      return assign({}, state, {
        highlight: !state.highlight
      });

    // FAVORITE from all resources list 
    case TOGGLE_FAVORITE_RESOURCES:
      if (state.id != action.id){
        return state;
      }

      return assign({}, state, {
        isFavorite: state.isFavorite!=null ? !state.isFavorite : true
      });

    // HIGHLIGHT from single
    case TOGGLE_HIGHLIGHT_RESOURCE:

      return assign({}, 
        state, 
        state.data.highlight = !state.data.highlight
      );
      
    // FAVORITE from single
    case TOGGLE_FAVORITE_RESOURCE:
      return assign({}, 
        state, 
        state.data.isFavorite = state.data.isFavorite!=null ? !state.data.isFavorite : true
      );
    default:
      return state;
  }
};

export function relatedResources(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RELATED_RESOURCES_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case RELATED_RESOURCES_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result
      })
    case RELATED_RESOURCES_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case RELATED_RESOURCES_RESET:
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
};

export function genericResource(state = INITIAL_STATE, action) {
  switch(action.type) {
    case GENERIC_RESOURCE_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case GENERIC_RESOURCE_SUCCESS:
      return assign({}, state, {
        fetching: false,
        fetched: true,
        data: action.data.result
      })
    case GENERIC_RESOURCE_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case GENERIC_RESOURCE_RESET:
      return assign({}, state, {
        fetching: false,
        fetched: false,
        data: null,
        errorMessage: null,
        errorStatus: null
      })
    case GENERIC_RESOURCE_RESET_ERRORS:
      return assign({}, state, {
        errorMessage: null,
        errorStatus: null
      })
    default:
      return state;
  }
};