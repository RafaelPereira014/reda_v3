'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchResources, setHighlights, setFavorites, searchResources, resetResources, fetchDominiosTemas } from '#/actions/resources';
import { fetchConfig } from '#/actions/config';
import { getFiltersResources, resetFiltersResources, setFiltersResources } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import ResourcesListing from '#/components/resources/listing';
import SearchListing from '#/components/search/advancedSearch';
import SearchListingRefactor from '#/components/search/advancedSearchRefactor';

function mapStateToProps(state) {
  return { 
    resources: state.resources,
    auth: state.auth,
    config: state.config,
    filtersResources: state.filtersResources,
    hashtag: state.hashtag
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchResources,
    fetchDominiosTemas, 
    fetchConfig, 
    setHighlights, 
    setFavorites,
    setFiltersResources,
    getFiltersResources,
    resetFiltersResources,
    searchResources,
    resetResources
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResourcesListing, SearchListing, SearchListingRefactor));