'use strict';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Overview from '%/components/overview';

//  Dispatch
import { fetchDashboardResume, resetDashboardResume } from '#/actions/dashboard';
import { fetchMonthResources, resetResources } from '#/actions/resources';

function mapStateToProps(state) {
  return { 
      dashboard: state.dashboard
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchDashboardResume,
    resetDashboardResume,
    fetchMonthResources,
    resetResources  
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Overview);