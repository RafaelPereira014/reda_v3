'use strict';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
//import ResourcesList from '%/components/resources/pending';
import HiddenList from '%/components/resources/hidden';

import { 
  fetchMyResources, 
  fetchMyFavorites, 
  setHighlights, 
  setFavorites, 
  setApproved,
  setApprovedUndo,
  setHiddenUndo,
  resetResources, 
  deleteResources, 
  deleteResource,
  hideResource,
} from '#/actions/resources';

import { 
  fetchTaxonomies, 
  resetTaxonomies, 
} from '#/actions/taxonomies';

import {
  fetchMessages,
  resetMessages
} from '#/actions/messages';

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
    setHiddenUndo,
    resetResources,
    deleteResources,
    deleteResource,
    hideResource,
    fetchMessages,
    resetMessages,
    fetchTaxonomies, 
    resetTaxonomies, 
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HiddenList));