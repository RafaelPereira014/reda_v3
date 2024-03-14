'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import AppsList from '%/components/apps/pending';

import { 
  fetchPending, 
  setApproved, 
  setApprovedUndo, 
  resetApps
} from '#/actions/apps';

import { 
  fetchTaxonomies, 
  resetTaxonomies, 
} from '#/actions/taxonomies';

import {
  fetchMessages
} from '#/actions/messages';

function mapStateToProps(state) {
  return { 
    apps: state.apps,
    auth: state.auth,
    config: state.config,
    messages: state.messages,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({
    fetchPending,
    setApproved,
    setApprovedUndo,
    resetApps,
    fetchTaxonomies,
    resetTaxonomies,
    fetchMessages
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppsList));