'use strict';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserProfileForm from '#/components/user/profile';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfileForm);