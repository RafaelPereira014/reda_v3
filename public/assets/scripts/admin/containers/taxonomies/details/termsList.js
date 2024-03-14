'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import TaxTermsList from '%/components/taxonomies/details/termsList';

import { 
  fetchTaxonomy, 
  resetTaxonomy, 
} from '#/actions/taxonomies';

import { 
  resetTaxTerms, 
  fetchTaxTerms, 
  deleteTerm
} from '#/actions/taxterms';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config,
    taxonomy: state.taxonomy,
    taxTerms: state.taxTerms
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchTaxonomy, 
    resetTaxonomy, 
    resetTaxTerms,
    fetchTaxTerms,
    deleteTerm
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TaxTermsList));