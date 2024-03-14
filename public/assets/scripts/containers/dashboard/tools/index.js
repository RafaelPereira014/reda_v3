'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { fetchMyTools, resetTools, deleteTools, deleteTool } from '#/actions/tools';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { bindActionCreators } from 'redux';
import ToolsList from '#/components/dashboard/tools/list';

function mapStateToProps(state) {
  return { 
    tools: state.tools,
    taxonomies: state.taxonomies,
    auth: state.auth,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchMyTools,
    resetTools,
    deleteTools, 
    deleteTool,
    fetchTaxonomies,
    resetTaxonomies
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolsList));