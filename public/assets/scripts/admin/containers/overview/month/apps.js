'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import AppsOverview from '%/components/overview/month/apps';

//  Dispatch
import { searchMonthApps, resetApps } from '#/actions/apps';

function mapStateToProps(state) {
  return { 
      apps: state.apps
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({
    searchMonthApps,
    resetApps  
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppsOverview));