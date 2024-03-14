'use strict';
import { connect } from 'react-redux';
import { hideResource } from '#/actions/resources';

import { bindActionCreators } from 'redux';
import HideResource from '../../components/resources/common/hideResource';

function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    hideResource
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HideResource);