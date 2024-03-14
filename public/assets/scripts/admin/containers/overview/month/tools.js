'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ToolsOverview from '%/components/overview/month/tools';

//  Dispatch
import { searchMonthTools, resetTools } from '#/actions/tools';

function mapStateToProps(state) {
  return { 
      tools: state.tools
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({
    searchMonthTools,
    resetTools  
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolsOverview));