'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchPending, resetScripts, setApproved, deleteScript, deleteScripts } from '#/actions/scripts';
import { fetchMessages, resetMessages } from '#/actions/messages';
import { fetchConfig, resetConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';
import ScriptsList from '#/components/dashboard/scripts/pending';

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
    deleteScript,
    deleteScripts,
    fetchMessages,
    resetMessages,
    fetchConfig,
    resetConfig
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScriptsList));