'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchApps, searchApps, resetApps } from '#/actions/apps';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { fetchSystems, resetSystems } from '#/actions/systems';
import { fetchConfig } from '#/actions/config';
import { getFilters, resetFilters, setFilters } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import AppsListing from '#/components/apps';

function mapStateToProps(state) {
  return { 
    apps: state.apps,
    auth: state.auth,
    config: state.config,
    filters: state.filters,
    systems: state.systems,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchApps, 
    fetchConfig, 
    setFilters,
    getFilters,
    resetFilters,
    searchApps,
    resetApps,
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    fetchSystems,
    resetSystems
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppsListing));