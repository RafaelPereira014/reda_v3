'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { bindActionCreators } from 'redux';
import TopBar from '../../components/common/topBar';
import { logout } from '#/actions/auth';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    logout
  }, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopBar));