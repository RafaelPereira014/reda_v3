'use strict';

import { connect } from 'react-redux';
import { fetchConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';
import TechPage from '#/components/techPage';

function mapStateToProps(state) {
  return { 
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TechPage);