'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import TaxDetails from '%/components/taxonomies/details';

import { 
  fetchTaxonomy, 
  resetTaxonomy, 
  submitTaxonomy
} from '#/actions/taxonomies';

import { 
  fetchTypes, 
  resetTypes, 
} from '#/actions/types';

import { addAlert } from '#/actions/alerts';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config,
    taxonomy: state.taxonomy,
    types: state.types
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchTaxonomy, 
    resetTaxonomy, 
    submitTaxonomy,
    fetchTypes,
    resetTypes,
    addAlert
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TaxDetails));