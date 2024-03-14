import assign from 'object-assign';
import { 
    TERMS_RELS_REQUEST, 
    TERMS_RELS_SUCCESS,
    TERMS_RELS_FAILURE,
    TERMS_RELS_RESET,
    TERMS_RELS_SET_TERM,
    TERMS_RELS_SET,
    TERMS_RELS_ADD_ROW,
    TERMS_RELS_REMOVE_ROW,
    TERMS_RELS_SEARCH,

    TERMS_RELS_UPDATE_REQUEST,
    TERMS_RELS_UPDATE_SUCCESS,
    TERMS_RELS_UPDATE_FAILURE
} from '#/actions/action-types';

const INITIAL_STATE = { fetching: false,
  fetched: false,
  data: null,
  errorMessage: null,
  errorStatus: null,
  curPage: null,
  total: null,
  totalPages: null
};

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case TERMS_RELS_REQUEST:
      return assign({}, state, {
        fetching: true
      })
    case TERMS_RELS_SUCCESS:
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
    case TERMS_RELS_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    case TERMS_RELS_RESET:
      return assign({}, state, INITIAL_STATE)

    case TERMS_RELS_SET_TERM:
      // CALL SINGLE REDUCER TO MAKE THE CHANGE
      return assign({}, state, {
        data: state.data.map((item, idx) => termRel(item, action, idx))        
      });

    //  Set relationship based on given object
    case TERMS_RELS_SET: {
      const item = state.data.map((item, idx) => {
        if(idx === action.idx){
          return action.data;
        }

        return item;
      })

      return assign({}, state, {
        data: item
      })
    }
    
    case TERMS_RELS_ADD_ROW:    
      return assign({}, state, {
        data: [{}, ...state.data]
      });

    case TERMS_RELS_REMOVE_ROW:
      return assign({}, state, {
        data: state.data.filter((el, idx) => idx!==action.idx)
      });

    //  Search with text
    case TERMS_RELS_SEARCH:
      
      return state;  

    case TERMS_RELS_UPDATE_REQUEST:
      break;

    //  Update term with relationship ID
    case TERMS_RELS_UPDATE_SUCCESS:
      if(action.data.update){
        return state;
      }
      
      return assign({}, state, {
        data: state.data.map((item, idx) => termRel(item, action, idx))
      });

      /* return state; */

    case TERMS_RELS_UPDATE_FAILURE:
      return assign({}, state, {
        fetching: false,
        errorMessage: action.message,
        errorStatus: action.status
      })
    default:
      return state;
  }
}

export const termRel = (state = INITIAL_STATE, action, idx) => {
  switch(action.type) {
    case TERMS_RELS_UPDATE_SUCCESS:
      //  Update with rel ID from DB
      if(parseInt(action.compData.index)!==parseInt(idx) ){
        return state;
      }

      return assign({}, 
        state, 
        {
          id: action.data.result.id,
        }
      );

    case TERMS_RELS_SET_TERM:
      // Update local with new term
      if(parseInt(action.idx)!==parseInt(idx)){
        return state;
      }

      return assign({}, 
        state, 
        {
          ['term_id_'+action.level]: action.term
        }
      );
    default:
      return state;
  }
}