'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { searchApps, resetApps, deleteApps, deleteApp } from '#/actions/apps';
import { bindActionCreators } from 'redux';
import AppsList from '%/components/apps';

import { 
  fetchTaxonomies, 
  resetTaxonomies, 
} from '#/actions/taxonomies';


function mapStateToProps(state) {
  return { 
    apps: state.apps,
    auth: state.auth,
    config: state.config,
    systems: state.systems,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    searchApps,
    resetApps,
    deleteApps, 
    deleteApp,
    fetchTaxonomies,
    resetTaxonomies
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppsList));