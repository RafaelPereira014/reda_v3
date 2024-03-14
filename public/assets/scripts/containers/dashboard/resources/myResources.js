'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { 
  fetchMyResources, 
  fetchMyFavorites, 
  setHighlights, 
  setFavorites, 
  setApproved,
  setApprovedUndo,
  resetResources, 
  deleteResources, 
  deleteResource 
} from '#/actions/resources';

import { 
  fetchTaxonomies, 
  resetTaxonomies, 
} from '#/actions/taxonomies';

import {
  fetchMessages
} from '#/actions/messages';
import { resetFilters } from '#/actions/filters';
import { fetchConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';
import MyResources from '#/components/dashboard/resources/myResources';

function mapStateToProps(state) {
  return { 
    resources: state.resources,
    auth: state.auth,
    config: state.config,
    messages: state.messages,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchMyResources,
    fetchMyFavorites,
    setHighlights, 
    setFavorites,
    setApproved,
    setApprovedUndo,
    fetchConfig, 
    resetFilters,
    resetResources,
    deleteResources,
    deleteResource,
    fetchMessages,
    fetchTaxonomies, 
    resetTaxonomies, 
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyResources));