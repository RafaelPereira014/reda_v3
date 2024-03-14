'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import TermsRels from '%/components/taxonomies/relationships';

import { 
  resetTermsRels, 
  fetchTermsRels, 
  deleteTermsRel,
  submitTermsRel,
  changeRelTerm,
  changeRel,
  addRelTermRow,
  deleteRelTermRow,
  searchTerm,
  submitRelChanges 
} from '#/actions/relationships';

import {
  fetchTaxonomies,
  resetTaxonomies
} from '#/actions/taxonomies';

import { addAlert } from '#/actions/alerts';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config,
    termsRels: state.termsRels,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    resetTermsRels, 
    fetchTermsRels, 
    deleteTermsRel,
    submitTermsRel,
    fetchTaxonomies,
    resetTaxonomies,
    changeRelTerm,
    changeRel,
    addRelTermRow,
    deleteRelTermRow,
    searchTerm,
    submitRelChanges,
    addAlert
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TermsRels));