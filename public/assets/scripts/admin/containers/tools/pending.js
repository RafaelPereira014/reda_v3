'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ToolsList from '%/components/tools/pending';

import { 
  fetchPending, 
  setApproved, 
  setApprovedUndo, 
  resetTools
} from '#/actions/tools';

import { 
  fetchTaxonomies, 
  resetTaxonomies, 
} from '#/actions/taxonomies';

import {
  fetchMessages
} from '#/actions/messages';

function mapStateToProps(state) {
  return { 
    tools: state.tools,
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
    resetTools,
    fetchTaxonomies,
    resetTaxonomies,
    fetchMessages
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolsList));