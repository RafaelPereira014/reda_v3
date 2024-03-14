'use strict';

import { connect } from 'react-redux';
import { addAlert } from '#/actions/alerts';
import { confirmSignup } from '#/actions/auth';
import { fetchConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';
import SignupConfirm from '#/components/auth/signupConfirm';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    addAlert,
    confirmSignup,
    fetchConfig
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupConfirm);