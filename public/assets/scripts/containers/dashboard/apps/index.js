'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { fetchMyApps, resetApps, deleteApps, deleteApp } from '#/actions/apps';
import { fetchSystems, resetSystems } from '#/actions/systems';
import { bindActionCreators } from 'redux';
import AppsList from '#/components/dashboard/apps/list';

function mapStateToProps(state) {
  return { 
    apps: state.apps,
    auth: state.auth,
    config: state.config,
    systems: state.systems
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchMyApps,
    resetApps,
    deleteApps, 
    deleteApp,
    fetchSystems,
    resetSystems
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppsList));