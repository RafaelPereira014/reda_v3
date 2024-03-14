'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ScriptsList from '%/components/scripts/pending';

import { fetchPending, resetScripts, setApproved, deleteScript, deleteScripts, setApprovedUndo } from '#/actions/scripts';


import {
  fetchMessages,
  resetMessages
} from '#/actions/messages';

function mapStateToProps(state) {
  return { 
    scripts: state.scripts,
    auth: state.auth,
    config: state.config,
    messages: state.messages
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchPending,
    resetScripts,
    setApproved,
    setApprovedUndo,
    deleteScript,
    deleteScripts,
    fetchMessages,
    resetMessages,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScriptsList));