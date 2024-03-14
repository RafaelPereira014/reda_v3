'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchResourcesWithMyScripts, resetResources } from '#/actions/resources';
import { bindActionCreators } from 'redux';
import ScriptsList from '#/components/dashboard/scripts/list';

function mapStateToProps(state) {
  return { 
    resources: state.resources,
    auth: state.auth,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchResourcesWithMyScripts,
    resetResources
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScriptsList));