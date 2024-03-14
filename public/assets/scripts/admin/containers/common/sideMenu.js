'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { bindActionCreators } from 'redux';
import SideMenu from '%/components/navigation/sideMenu';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    
  }, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideMenu));