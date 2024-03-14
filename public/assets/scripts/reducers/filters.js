import assign from 'object-assign';
import { 
	FILTERS_GET, 
	FILTERS_SET,
  FILTERS_RESET,
  FILTERS_RESOURCES_GET, 
  FILTERS_RESOURCES_SET,
  FILTERS_RESOURCES_RESET,
  FILTERS_APPS_GET, 
  FILTERS_APPS_SET,
  FILTERS_APPS_RESET,
  FILTERS_TOOLS_GET, 
  FILTERS_TOOLS_SET,
  FILTERS_TOOLS_RESET
} from '#/actions/action-types';

const INITIAL_STATE = { data: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FILTERS_GET:
      return state;
    case FILTERS_SET:
      return assign({}, state, {
        data: action.filters
      })
    case FILTERS_RESET:
      return assign({}, state, {
        data: null
      })
    default:
      return state;
  }
}

export function filtersResources(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FILTERS_RESOURCES_GET:
      return state;
    case FILTERS_RESOURCES_SET:
      return assign({}, state, {
        data: action.filters
      })
    case FILTERS_RESOURCES_RESET:
      return assign({}, state, {
        data: null
      })
    default:
      return state;
  }
}

export function filtersApps(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FILTERS_APPS_GET:
      return state;
    case FILTERS_APPS_SET:
      return assign({}, state, {
        data: action.filters
      })
    case FILTERS_APPS_RESET:
      return assign({}, state, {
        data: null
      })
    default:
      return state;
  }
}

export function filtersTools(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FILTERS_TOOLS_GET:
      return state;
    case FILTERS_TOOLS_SET:
      return assign({}, state, {
        data: action.filters
      })
    case FILTERS_TOOLS_RESET:
      return assign({}, state, {
        data: null
      })
    default:
      return state;
  }
}