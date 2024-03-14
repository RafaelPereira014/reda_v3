'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ResourcesOverview from '%/components/overview/month/resources';

//  Dispatch
import { searchMonthResources, resetResources } from '#/actions/resources';

function mapStateToProps(state) {
  return { 
      resources: state.resources
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({
    searchMonthResources,
    resetResources  
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResourcesOverview));