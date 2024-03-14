'use strict';

import { connect } from 'react-redux';
import DashboardMenu from '#/components/navigation/dashboardMenu';

function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}


export default connect(mapStateToProps, null)(DashboardMenu);