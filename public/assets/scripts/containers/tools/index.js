'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTools, resetTools, searchTools } from '#/actions/tools';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { fetchConfig } from '#/actions/config';
import { getFilters, resetFilters, setFilters } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import ToolsListing from '#/components/tools';

function mapStateToProps(state) {
  return { 
    tools: state.tools,
    taxonomies: state.taxonomies,
    auth: state.auth,
    config: state.config,
    filters: state.filters
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig, 
    setFilters,
    getFilters,
    resetFilters,
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    fetchTools,
    resetTools,
    searchTools
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolsListing));